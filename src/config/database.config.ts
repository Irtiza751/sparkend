import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Injectable()
export class DatabaseConfig implements MikroOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMikroOrmOptions(): MikroOrmModuleOptions {
    const isDevMode = this.configService.get('NODE_ENV') === 'development';

    return {
      driver: PostgreSqlDriver,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      user: this.configService.get<string>('DB_USER', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      dbName: this.configService.get<string>('DB_NAME', 'nestjs_boilerplate'),
      // ✅ Entities
      ...(!isDevMode && {
        entities: ['dist/**/*.entity.js'],
      }),
      entitiesTs: ['src/**/*.entity.ts'],
      // ✅ Migrations
      migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
        glob: '!(*.d).{js,ts}',
        transactional: true,
        disableForeignKeys: false,
        emit: 'ts',
      },
      // ✅ Seeders
      seeder: {
        path: 'dist/seeders',
        pathTs: 'src/seeders',
      },
      // ✅ Auto-load entities only in dev
      autoLoadEntities: isDevMode,
      // ✅ Logging
      debug: isDevMode,
      // ✅ Useful for CLI
      allowGlobalContext: true,
    };
  }
}
