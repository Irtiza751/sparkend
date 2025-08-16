import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { RoleProvider } from '@/features/role/providers/role-provider';
// import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
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
    /**
     * @description mail service
     */
    // private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let role: Role | null = null;
    try {
      role = await this.roleProvider.findByName(createUserDto.role);
    } catch (error) {
      throw new RequestTimeoutException();
    }
    if (!role) {
      throw new NotFoundException(`Role ${createUserDto.role} does not exist.`);
    }
    try {
      const user = this.userRepository.create({
        ...createUserDto,
        roles: [role],
      });
      await this.em.persistAndFlush(user);

      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException(`Username and email must be unique.`);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: string) {
    return this.userRepository.findOne(id, { populate: ['roles'] });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ username }, { populate: ['roles'] });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email }, { populate: ['roles'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    wrap(user).assign(updateUserDto);
    return await this.em.persistAndFlush(User);
  }

  async markUserAsVerified(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    user.vefified = true;
    return this.em.flush();
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
