import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserProvider } from './providers/user-provider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProvider],
  imports: [MikroOrmModule.forFeature([User])],
  exports: [UserProvider],
})
export class UserModule {}
