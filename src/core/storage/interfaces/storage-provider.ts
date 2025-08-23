import { StorageResult } from './storage-result';

export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<StorageResult>;
  delete(id: string): Promise<void>;
  getUrl(id: string): Promise<string>;
  getFile(id: string): Promise<Buffer>;
  exists(id: string): Promise<boolean>;
}
