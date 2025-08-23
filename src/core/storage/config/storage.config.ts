import { registerAs } from '@nestjs/config';

export default registerAs('storageConfig', () => ({
  uploadPath: process.env.DISK_UPLOAD_PATH || './uploads',
  baseUrl: process.env.DISK_BASE_URL || 'http://localhost:4000/files',
  // for s3 (optional)
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsS3Bucket: process.env.AWS_S3_BUCKET || '',
}));
