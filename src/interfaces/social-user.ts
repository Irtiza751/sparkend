import { AuthProvider } from '@/features/user/enums/auth-provider';
import { UserRoles } from '@/features/role/enums/user-role.enum';

export interface SocialUser {
  provider: AuthProvider;
  providerId: string;
  email: string;
  username: string;
  avatar: string;
  verified: boolean;
  role: UserRoles;
  accessToken: string;
}
