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
  ) {}

  async createSocialUser(user: SocialUser) {
    try {
      const socialUser = this.userRepository.create(user);
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
