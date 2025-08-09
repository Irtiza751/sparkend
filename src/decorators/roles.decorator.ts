import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../role/enums/user-role.enum';

export const Roles = (...args: UserRoles[]) => SetMetadata('roles', args);
