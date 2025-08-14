import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { RoleProvider } from './providers/role-provider';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleProvider],
  imports: [MikroOrmModule.forFeature([Role])],
  exports: [RoleProvider],
})
export class RoleModule {}
