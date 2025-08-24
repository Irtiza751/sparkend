import { SetMetadata } from '@nestjs/common';
import { Roles as UserRoles } from '../enums/roles.enum';

export const Roles = (role: UserRoles) => SetMetadata('role', role);
