import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { StorageService } from '@/core/storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    /**
     * @description Injecting the User repository to perform CRUD operations
     */
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    /**
     * @description Injecting the EntityManager for advanced database operations
     */
    private readonly em: EntityManager,
    /**
     * @description storage service to handle file uploads
     */
    private readonly storageService: StorageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.em.persistAndFlush(user);

      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException(`Username and email must be unique.`);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: string) {
    return this.userRepository.findOne(id);
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    wrap(user).assign(updateUserDto);
    return await this.em.flush();
  }

  async markUserAsVerified(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    user.verified = true;
    return this.em.flush();
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async uploadAvatar(file: Express.Multer.File, userId: string) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      const uploadFile = await this.storageService.uploadFile(file);
      if (!uploadFile) {
        throw new InternalServerErrorException('Failed to upload avatar');
      }
      Logger.log(uploadFile, 'Upload File');
      user.avatar = uploadFile.url;
      await this.em.flush();
      return {
        message: 'Avatar uploaded successfully',
        url: uploadFile.url,
      };
    } catch (error) {
      Logger.error(error, 'UserService.uploadAvatar');
      throw new RequestTimeoutException();
    }
  }
}
