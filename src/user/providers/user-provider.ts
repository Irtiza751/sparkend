import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

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
}
