import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RoleGuard } from '@/common/guards/role.guard';
import { Roles } from '@core/decorators/roles.decorator';
import { Roles as UserRoles } from '@/core/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@core/decorators/user.decorator';
import { JwtPayload } from '@core/interfaces/jwt-payload.interface';
import { UploadAvatarDto } from './dto/upload-avatar.dto';

@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @User() user: JwtPayload,
  ) {
    return this.userService.uploadAvatar(file, user.sub);
  }
}
