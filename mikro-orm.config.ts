import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { config } from 'dotenv';
import { Migrator } from '@mikro-orm/migrations';

config();

const mikroOrmConfig: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  dbName: process.env.DB_NAME || 'nestjs_boilerplate',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: 'dist/migrations',   // for production
    pathTs: 'src/migrations',  // for development
    glob: '!(*.d).{js,ts}',    // recommended to support both
    transactional: true,
    disableForeignKeys: false,
    emit: 'ts',                // keep migrations in TS
  },
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
  },
  extensions: [
    Migrator,
  ]
};

export default mikroOrmConfig;