import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '@/features/role/enums/user-role.enum';

export const Roles = (...args: UserRoles[]) => SetMetadata('roles', args);
