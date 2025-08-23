import { Inject, Injectable } from '@nestjs/common';
import { StorageProvider } from './interfaces/storage-provider';
import { STORAGE_PROVIDER } from './constants/storage';
import { StorageResult } from './interfaces/storage-result';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,
  ) {}

  uploadFile(file: Express.Multer.File): Promise<StorageResult> {
    return this.storageProvider.upload(file);
  }
}
