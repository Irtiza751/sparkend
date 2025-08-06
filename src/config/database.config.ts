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
    return {
      driver: PostgreSqlDriver,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      user: this.configService.get<string>('DB_USER', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      dbName: this.configService.get<string>('DB_NAME', 'nestjs_boilerplate'),
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
        glob: '!(*.d).{js,ts}', // recommended to support bot
        transactional: true,
        disableForeignKeys: false,
        emit: 'ts', // keep migrations in TS
      },
      seeder: {
        path: 'dist/seeders',
        pathTs: 'src/seeders',
      },
      debug: this.configService.get<string>('NODE_ENV') !== 'production',
    };
  }
}
