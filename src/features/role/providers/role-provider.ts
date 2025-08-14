import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { SqlEntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class RoleProvider {
  constructor(
    /**
     * @description Injecting the User repository to perform CRUD operations
     */
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    /**
     * @description Injecting the EntityManager for advanced database operations
     */
    private readonly em: SqlEntityManager,
  ) {}

  findByName(name: string): Promise<Role | null> {
    const qb = this.em
      .createQueryBuilder(Role, 'role')
      .select(['name', 'id'])
      .where({ name });

    return qb.getSingleResult();
  }
}
