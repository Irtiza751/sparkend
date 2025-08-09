import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AuthProvider } from '../user/enums/auth-provider';
import { User } from '../user/entities/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const users = [
      {
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'password123',
        roles: [context.adminRole, context.userRole],
        provider: AuthProvider.LOCAL,
        isEmailVerified: true,
      },
      {
        email: 'jane.doe@example.com',
        username: 'janedoe',
        password: 'password123',
        roles: [context.userRole],
        provider: AuthProvider.LOCAL,
        isEmailVerified: false,
      },
    ];

    for (let userData of users) {
      em.create(User, userData);
    }
  }
}
