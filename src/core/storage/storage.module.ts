import { DynamicModule, Module } from '@nestjs/common';
import { DiskStorageProvider } from './providers/disk-storage';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import storageConfig from './config/storage.config';
import { StorageType } from './enums/storage-type';
import { STORAGE_PROVIDER } from './constants/storage';
import { StorageProvider } from './interfaces/storage-provider';

interface StorageModuleOptions {
  type: StorageType;
}

export interface StorageFeatureOptions {
  name: string;
  type?: StorageType;
  config?: Record<string, any>;
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

  static forFeature(options: StorageFeatureOptions): DynamicModule {
    const featureProviderToken = `STORAGE_PROVIDER_${options.name.toUpperCase()}`;
    const featureServiceToken = `STORAGE_SERVICE_${options.name.toUpperCase()}`;

    const providers = [
      {
        provide: featureProviderToken,
        useFactory: () => {
          const ProviderClass = this.getStorageProvider(
            options.type || StorageType.DISK,
          );
          return new ProviderClass(options.config);
        },
      },
      {
        provide: featureServiceToken,
        useFactory: (provider: StorageProvider) => {
          return new StorageService(provider);
        },
        inject: [featureProviderToken],
      },
    ];

    return {
      module: StorageModule,
      providers,
      exports: [featureServiceToken],
    };
  }

  static forFeatureAsync(options: {
    name: string;
    useFactory: (
      ...args: any[]
    ) => StorageFeatureOptions | Promise<StorageFeatureOptions>;
    inject?: any[];
  }): DynamicModule {
    const featureProviderToken = `STORAGE_PROVIDER_${options.name.toUpperCase()}`;
    const featureServiceToken = `STORAGE_SERVICE_${options.name.toUpperCase()}`;

    const providers = [
      {
        provide: featureProviderToken,
        useFactory: async (...args: any[]) => {
          const config = await options.useFactory(...args);
          const ProviderClass = this.getStorageProvider(
            config.type || StorageType.DISK,
          );
          return new ProviderClass(config.config);
        },
        inject: options.inject || [],
      },
      {
        provide: featureServiceToken,
        useFactory: (provider: StorageProvider) => {
          return new StorageService(provider);
        },
        inject: [featureProviderToken],
      },
    ];

    return {
      module: StorageModule,
      providers,
      exports: [featureServiceToken],
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
