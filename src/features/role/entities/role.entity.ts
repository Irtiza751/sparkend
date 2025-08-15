import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '@/classes/base-entity';
import { User } from '@/features/user/entities/user.entity';

@Entity()
export class Role extends BaseEntity<'users'> {
  @Property({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles, { mappedBy: 'roles' })
  users = new Collection<User>(this);

  @BeforeCreate()
  @BeforeUpdate()
  lowerCaseName() {
    this.name = this.name.toLowerCase();
  }
}
