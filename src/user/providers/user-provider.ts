import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class UserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) { }
}
