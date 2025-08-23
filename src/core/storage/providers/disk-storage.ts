import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageProvider } from '../interfaces/storage-provider';
import { ConfigType } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { StorageResult } from '../interfaces/storage-result';

import storageConfig from '../config/storage.config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DiskStorageProvider implements StorageProvider {
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConfigService: ConfigType<typeof storageConfig>,
  ) {
    this.uploadPath = this.storageConfigService.uploadPath;
    this.baseUrl = this.storageConfigService.baseUrl;
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
      Logger.log(`Upload directory exists at ${this.uploadPath}`);
    } catch {
      Logger.log(`Upload directory doesn't exists at ${this.uploadPath}`);
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File): Promise<StorageResult> {
    const id = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${id}${ext}`;
    const filePath = path.join(this.uploadPath, filename);

    await fs.writeFile(filePath, file.buffer);

    return {
      id,
      url: `${this.baseUrl}/${filename}`,
      filename,
      size: file.size,
      mimetype: file.mimetype,
      metadata: { path: filePath },
    };
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getUrl(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getFile(id: string): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }

  exists(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
