import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AuthProvider } from '@/features/user/enums/auth-provider';
import { User } from '@/features/user/entities/user.entity';
import { Roles } from '@/enums/roles.enum';

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const users = [
      {
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'password123',
        // roles: [context.adminRole, context.userRole],
        role: Roles.ADMIN,
        provider: AuthProvider.LOCAL,
        isEmailVerified: true,
      },
      {
        email: 'jane.doe@example.com',
        username: 'janedoe',
        password: 'password123',
        // roles: [context.userRole],
        role: Roles.USER,
        provider: AuthProvider.LOCAL,
        isEmailVerified: false,
      },
    ];

    for (let userData of users) {
      em.create(User, userData);
    }
  }
}
