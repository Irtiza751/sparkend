import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageProvider } from '../interfaces/storage-provider';
import { ConfigType } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { StorageResult } from '../interfaces/storage-result';
// default imports
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

  async delete(id: string): Promise<void> {
    const files = await fs.readdir(this.uploadPath);
    const fileToDelete = files.find((file) => file.startsWith(id));
    if (fileToDelete) {
      const filePath = path.join(this.uploadPath, fileToDelete);
      await fs.unlink(filePath);
    } else {
      throw new Error('File not found');
    }
  }

  async getUrl(id: string): Promise<string> {
    const files = await fs.readdir(this.uploadPath);
    const file = files.find((f) => f.startsWith(id));

    if (!file) {
      throw new Error('File not found');
    }

    return `${this.baseUrl}/${file}`;
  }

  async getFile(id: string): Promise<Buffer> {
    const files = await fs.readdir(this.uploadPath);
    const file = files.find((f) => f.startsWith(id));

    if (!file) {
      throw new Error('File not found');
    }

    return fs.readFile(path.join(this.uploadPath, file));
  }

  async exists(id: string): Promise<boolean> {
    const files = await fs.readdir(this.uploadPath);
    return files.some((f) => f.startsWith(id));
  }
}
