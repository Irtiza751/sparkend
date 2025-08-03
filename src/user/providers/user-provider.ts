import {
  EntityManager,
  EntityRepository,
  RequiredEntityData,
  UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateUserDto } from '../dto/create-user.dto';

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
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(
        createUserDto as RequiredEntityData<User>,
      );
      await this.em.persistAndFlush(user);
      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException(`Usernmae and email must be unique.`);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
