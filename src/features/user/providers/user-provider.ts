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
} from '@nestjs/common';
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
  ) {}
}
