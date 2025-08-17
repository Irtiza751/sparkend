import {
  EntityManager,
  EntityRepository,
  RequiredEntityData,
  UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { SocialUser } from '@/interfaces/social-user';
import { RoleProvider } from '@/features/role/providers/role-provider';
import { Role } from '@/features/role/entities/role.entity';

@Injectable()
export class UserProvider {
  constructor(
    /**
     * @description Injecting the User repository to perform CRUD operations
     */
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    /**
     * @description Injecting the EntityManager for advanced database operations
     */
    private readonly em: EntityManager,
    /**
     * @description The RoleProvider is used to interact with role data.
     */
    private readonly roleProvider: RoleProvider,
  ) {}

  async createSocialUser(user: SocialUser) {
    let role: Role | null = null;
    try {
      role = await this.roleProvider.findByName(user.role);
    } catch (error) {
      throw new RequestTimeoutException();
    }
    if (!role) {
      throw new NotFoundException(`Role ${user.role} does not exist.`);
    }
    try {
      const socialUser = this.userRepository.create({
        ...user,
        roles: [role],
      });
      await this.em.persistAndFlush(socialUser);

      return {
        message: 'User created successfully',
        socialUser,
      };
    } catch (error) {
      Logger.error(error, 'error-creating-user');
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException(`Username and email must be unique.`);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
