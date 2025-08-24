import { Roles } from '@/core/enums/roles.enum';

export interface JwtPayload {
  /**
   * @description user's uuid v4
   */
  sub: string;
  /**
   * @description logged in user email
   */
  email: string;
  /**
   * @description logged in user username
   */
  username: string;
  /**
   * @description assigned role of logged in user
   */
  role: Roles;
}
