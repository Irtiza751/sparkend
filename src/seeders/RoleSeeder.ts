import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../role/entities/role.entity';

export class RoleSeeder extends Seeder {

  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const roles = [
      {
        name: 'User',
      },
      {
        name: 'Admin'
      }
    ]

    for (let roleData of roles) {
      context[roleData.name.toLowerCase() + 'Role'] = em.create(Role, roleData);
    }
  }
}
