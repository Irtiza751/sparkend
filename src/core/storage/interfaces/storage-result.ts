export interface StorageResult {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimetype: string;
  metadata: { path: string };
}
