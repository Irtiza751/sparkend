import { DynamicModule, Module } from '@nestjs/common';
import { DiskStorageProvider } from './providers/disk-storage';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import storageConfig from './config/storage.config';
import { StorageType } from './enums/storage-type';
import { STORAGE_PROVIDER } from './constants/storage';

interface StorageModuleOptions {
  type: StorageType;
}

@Module({
  providers: [DiskStorageProvider, StorageService],
  imports: [ConfigModule.forFeature(storageConfig)],
})
export class StorageModule {
  static forRoot(options: StorageModuleOptions) {
    const providers = [
      StorageService,
      {
        provide: STORAGE_PROVIDER,
        useClass: this.getStorageProvider(options.type),
      },
    ];

    return {
      module: StorageModule,
      providers,
      exports: [StorageService],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => StorageModuleOptions | Promise<StorageModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        StorageService,
        {
          provide: STORAGE_PROVIDER,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return new (this.getStorageProvider(config.type))();
          },
          inject: options.inject || [],
        },
      ],
      exports: [StorageService],
      global: true,
    };
  }

  private static getStorageProvider(type: StorageType): any {
    switch (type) {
      case StorageType.DISK:
        return DiskStorageProvider;
      case StorageType.S3:
        throw new Error('S3 storage provider not implemented yet');
      default:
        return DiskStorageProvider;
    }
  }
}
