import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { AuthProvider } from '../enums/auth-provider';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { BaseEntity } from '@/classes/base-entity';
import { Roles } from '@/enums/roles.enum';

@Entity({ tableName: 'users' })
export class User extends BaseEntity<'roles'> {
  @Property()
  @Unique()
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @Property()
  @Unique()
  @ApiProperty({ example: 'John Doe' })
  email: string;

  @Property({ hidden: true, nullable: true })
  password?: string;

  @Enum(() => Roles)
  @ApiProperty({ enum: Roles, example: Roles.USER })
  role: Roles = Roles.USER;

  @Enum(() => AuthProvider)
  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  provider: AuthProvider;

  @Property({ nullable: true })
  @ApiProperty({ example: 'google-id-123' })
  providerId?: string;

  @Property({ type: 'boolean', nullable: true, default: false })
  @ApiProperty({ example: false })
  verified?: boolean;

  @Property({ nullable: true })
  @ApiProperty({ example: 'profile-picture.jpg' })
  avatar?: string;

  @Property({ type: 'boolean', default: true, nullable: true })
  @ApiProperty({ example: true })
  isActive?: boolean;

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }
}
