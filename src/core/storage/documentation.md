# NestJS Storage Module Documentation

A flexible, swappable storage module for NestJS applications that supports multiple storage providers (Disk, AWS S3, Cloudinary) with a unified API.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Storage Providers](#storage-providers)
- [File Serving](#file-serving)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

### 2. Create Storage Module Structure

```
src/
├── core/
│   └── storage/
│       ├── interfaces/
│       │   └── storage.interface.ts
│       ├── providers/
│       │   ├── disk-storage.provider.ts <-- already created
│       │   ├── s3-storage.provider.ts
│       │   └── cloudinary-storage.provider.ts
│       ├── enums/
│       │   └── storage-type.enum.ts <- add more types of providers as per need
│       ├── storage.service.ts
│       └── storage.module.ts
└── features/
    └── files/
        ├── files.controller.ts
        ├── files.service.ts
        ├── files.module.ts
        └── entities/
            └── file.entity.ts
```

## Quick Start

### 1. Basic Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { StorageModule } from './common/storage/storage.module';
import { StorageType } from './common/storage/enums/storage-type.enum';

@Module({
  imports: [
    StorageModule.forRoot({
      type: StorageType.DISK, // or S3, CLOUDINARY
    }),
  ],
})
export class AppModule {}
```

### 2. Basic File Upload

```typescript
// files.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../common/storage/storage.service';

@Controller('files')
export class FilesController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.storageService.uploadFile(file);
    return { message: 'File uploaded successfully', file: result };
  }
}
```

## Configuration

### Environment-Based Configuration

```typescript
// app.module.ts
StorageModule.forRootAsync({
  useFactory: () => ({
    type: (process.env.STORAGE_TYPE as StorageType) || StorageType.DISK,
  }),
});
```

### Environment Variables

```env
# General
STORAGE_TYPE=disk  # or 's3', 'cloudinary'

# Disk Storage
DISK_UPLOAD_PATH=./uploads
DISK_BASE_URL=http://localhost:3000/uploads

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Configuration with Options

```typescript
// For more control over configuration
StorageModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: configService.get('STORAGE_TYPE') as StorageType,
    config: {
      // Provider-specific configuration
      uploadPath: configService.get('DISK_UPLOAD_PATH'),
      baseUrl: configService.get('DISK_BASE_URL'),
    },
  }),
  inject: [ConfigService],
});
```

## Usage Examples

### Basic File Operations

```typescript
// files.service.ts
import { Injectable } from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service';

@Injectable()
export class FilesService {
  constructor(private readonly storageService: StorageService) {}

  // Upload file
  async uploadFile(file: Express.Multer.File, options?: any) {
    return this.storageService.uploadFile(file, options);
  }

  // Get file URL
  async getFileUrl(fileId: string) {
    return this.storageService.getFileUrl(fileId);
  }

  // Download file
  async downloadFile(fileId: string) {
    return this.storageService.downloadFile(fileId);
  }

  // Delete file
  async deleteFile(fileId: string) {
    return this.storageService.deleteFile(fileId);
  }

  // Check if file exists
  async fileExists(fileId: string) {
    return this.storageService.fileExists(fileId);
  }
}
```

### File Upload with Validation

```typescript
// files.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const uploadResult = await this.filesService.uploadFile(file, {
      folder: 'images',
    });

    return {
      message: 'Image uploaded successfully',
      file: uploadResult,
    };
  }
}
```

### Multiple File Upload

```typescript
@Post('upload-multiple')
@UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
async uploadMultipleFiles(
  @UploadedFiles() files: Express.Multer.File[],
) {
  const uploadPromises = files.map(file =>
    this.storageService.uploadFile(file, { folder: 'gallery' })
  );

  const results = await Promise.all(uploadPromises);

  return {
    message: `${results.length} files uploaded successfully`,
    files: results,
  };
}
```

### Feature-Specific Storage

```typescript
// users.module.ts
@Module({
  imports: [
    // Feature-specific storage for avatars
    StorageModule.forFeature({
      name: 'user-avatars',
      type: StorageType.CLOUDINARY,
      config: {
        folder: 'avatars',
        transformation: { width: 200, height: 200, crop: 'fill' },
      },
    }),
  ],
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @Inject('STORAGE_SERVICE_USER_AVATARS')
    private readonly avatarStorage: StorageService,
  ) {}

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const result = await this.avatarStorage.uploadFile(file, {
      public_id: `user_${userId}_avatar`,
    });

    // Update user record with new avatar URL
    return result;
  }
}
```

## API Reference

### StorageModule

#### `forRoot(options: StorageModuleOptions)`

Configure storage module globally.

```typescript
interface StorageModuleOptions {
  type: StorageType;
  name?: string;
  config?: Record<string, any>;
}
```

#### `forRootAsync(options: StorageModuleAsyncOptions)`

Configure storage module asynchronously.

#### `forFeature(options: StorageFeatureOptions)`

Configure feature-specific storage.

```typescript
interface StorageFeatureOptions {
  name: string;
  type?: StorageType;
  config?: Record<string, any>;
}
```

### StorageService

#### `uploadFile(file: StorageFile, options?: any): Promise<UploadResult>`

Upload a file to the configured storage provider.

**Parameters:**

- `file`: File to upload (Express.Multer.File)
- `options`: Provider-specific options (folder, metadata, etc.)

**Returns:** `UploadResult`

```typescript
interface UploadResult {
  id: string; // Unique identifier
  url: string; // Public URL
  filename: string; // Generated filename
  size: number; // File size in bytes
  mimetype: string; // MIME type
  metadata?: Record<string, any>; // Provider-specific metadata
}
```

#### `deleteFile(id: string): Promise<void>`

Delete a file from storage.

#### `getFileUrl(id: string): Promise<string>`

Get the public URL of a file.

#### `downloadFile(id: string): Promise<Buffer>`

Download file content as a Buffer.

#### `fileExists(id: string): Promise<boolean>`

Check if a file exists in storage.

### Storage Providers

#### Upload Options by Provider

**Disk Storage:**

```typescript
{
  folder?: string;        // Subfolder within uploads
}
```

**S3 Storage:**

```typescript
{
  folder?: string;        // S3 key prefix
  acl?: string;          // Access control (public-read, private, etc.)
  metadata?: object;     // Custom metadata
  storageClass?: string; // Storage class (STANDARD, STANDARD_IA, etc.)
}
```

**Cloudinary:**

```typescript
{
  folder?: string;       // Cloudinary folder
  public_id?: string;    // Custom public ID
  transformation?: {     // Image transformations
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  };
}
```

## File Serving

### Option 1: ServeStaticModule (Recommended)

```typescript
// app.module.ts
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // Important: Don't look for index.html
        setHeaders: (res, path) => {
          if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            res.setHeader('Cache-Control', 'public, max-age=31557600');
          }
        },
      },
    }),
  ],
})
export class AppModule {}
```

**Access files at:** `http://localhost:3000/uploads/filename.jpg`

### Option 2: Custom File Controller

```typescript
// static-files.controller.ts
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('uploads')
export class StaticFilesController {
  @Get(':filename')
  async serveFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = createReadStream(join(process.cwd(), 'uploads', filename));

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }
}
```

### Option 3: Express Static Assets

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    index: false,
  });

  await app.listen(3000);
}
```

## Advanced Usage

### Database Integration

```typescript
// file.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  storageId: string; // Storage provider's file ID

  @Column()
  url: string;

  @Column()
  storageProvider: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;
}
```

```typescript
// files.service.ts
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly storageService: StorageService,
  ) {}

  async uploadAndSave(file: Express.Multer.File) {
    // Upload to storage
    const uploadResult = await this.storageService.uploadFile(file);

    // Save metadata to database
    const fileEntity = this.fileRepository.create({
      originalName: file.originalname,
      storageId: uploadResult.id,
      url: uploadResult.url,
      storageProvider: process.env.STORAGE_TYPE || 'disk',
      metadata: uploadResult.metadata,
    });

    return this.fileRepository.save(fileEntity);
  }
}
```

### File Processing Pipeline

```typescript
// image-processing.service.ts
@Injectable()
export class ImageProcessingService {
  constructor(private readonly storageService: StorageService) {}

  async processAndUpload(file: Express.Multer.File) {
    // Process image (resize, optimize, etc.)
    const processedBuffer = await this.resizeImage(file.buffer);

    // Create processed file object
    const processedFile = {
      ...file,
      buffer: processedBuffer,
      filename: `processed_${file.originalname}`,
    };

    // Upload processed file
    return this.storageService.uploadFile(processedFile);
  }

  private async resizeImage(buffer: Buffer): Promise<Buffer> {
    // Image processing logic (using sharp, jimp, etc.)
    return buffer;
  }
}
```

### Storage Migration

```typescript
// storage-migration.service.ts
@Injectable()
export class StorageMigrationService {
  async migrateToNewStorage(
    fromStorage: StorageService,
    toStorage: StorageService,
    fileIds: string[],
  ) {
    for (const fileId of fileIds) {
      try {
        // Download from old storage
        const fileBuffer = await fromStorage.downloadFile(fileId);

        // Create file object for upload
        const fileObj = {
          buffer: fileBuffer,
          originalname: `migrated_${fileId}`,
          mimetype: 'application/octet-stream',
          size: fileBuffer.length,
        } as Express.Multer.File;

        // Upload to new storage
        const result = await toStorage.uploadFile(fileObj);

        // Delete from old storage
        await fromStorage.deleteFile(fileId);

        console.log(`Migrated file ${fileId} -> ${result.id}`);
      } catch (error) {
        console.error(`Failed to migrate file ${fileId}:`, error);
      }
    }
  }
}
```

## Best Practices

### 1. Security

```typescript
// File validation
const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null, true);
  } else {
    callback(new Error('Invalid file type'));
  }
};

// Use in controller
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  })
)
```

### 2. Error Handling

```typescript
@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File) {
    try {
      return await this.storageService.uploadFile(file);
    } catch (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        throw new BadRequestException('File too large');
      }
      if (error.code === 'INVALID_FILE_TYPE') {
        throw new BadRequestException('Invalid file type');
      }
      throw new InternalServerErrorException('Upload failed');
    }
  }
}
```

### 3. Performance

```typescript
// Async file processing
@Post('upload')
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // Quick response
  const uploadResult = await this.storageService.uploadFile(file);

  // Background processing
  setImmediate(() => {
    this.processFileAsync(uploadResult.id);
  });

  return uploadResult;
}
```

### 4. Configuration Management

```typescript
// config/storage.config.ts
export default registerAs('storage', () => ({
  type: process.env.STORAGE_TYPE || 'disk',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
  allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'png'],
  disk: {
    uploadPath: process.env.DISK_UPLOAD_PATH || './uploads',
    baseUrl: process.env.DISK_BASE_URL || 'http://localhost:3000/uploads',
  },
}));
```

## Troubleshooting

### Common Issues

**1. "File not found" when serving files**

```typescript
// Ensure correct path resolution
ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'uploads'), // Not __dirname
  serveStaticOptions: { index: false }, // Important!
});
```

**2. "ENOENT: no such file or directory"**

```typescript
// Check upload directory exists
private async ensureUploadDirectory() {
  const uploadPath = join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
  }
}
```

**3. Storage provider errors**

```typescript
// Add retry logic
async uploadWithRetry(file: Express.Multer.File, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.storageService.uploadFile(file);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

**4. Memory issues with large files**

```typescript
// Use streaming for large files
import { createReadStream } from 'fs';

@Get(':id/download')
async downloadLargeFile(@Param('id') id: string) {
  const filePath = await this.getFilePath(id);
  const stream = createReadStream(filePath);
  return new StreamableFile(stream);
}
```

### Debug Mode

```typescript
// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Storage configuration:', {
    type: this.storageType,
    uploadPath: this.uploadPath,
    baseUrl: this.baseUrl,
  });
}
```

This documentation should help you implement and use the storage module effectively in your NestJS application!
