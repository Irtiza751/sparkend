import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserProvider } from './providers/user-provider';
import { CommonModule } from '../../common/common.module';
// import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProvider],
  imports: [MikroOrmModule.forFeature([User]), CommonModule],
  exports: [UserProvider, UserService],
})
export class UserModule {}
