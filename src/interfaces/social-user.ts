import { AuthProvider } from '@/features/user/enums/auth-provider';
import { Roles } from '@/enums/roles.enum';

export interface SocialUser {
  provider: AuthProvider;
  providerId: string;
  email: string;
  username: string;
  avatar: string;
  verified: boolean;
  role: Roles;
  accessToken: string;
}
