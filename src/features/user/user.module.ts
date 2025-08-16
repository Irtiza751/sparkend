import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserProvider } from './providers/user-provider';
import { RoleModule } from '../role/role.module';
// import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProvider],
  imports: [MikroOrmModule.forFeature([User]), RoleModule /* MailModule */],
  exports: [UserProvider, UserService],
})
export class UserModule {}
