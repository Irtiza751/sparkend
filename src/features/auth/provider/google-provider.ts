import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { UserService } from '@/features/user/user.service';

import { SocialUser } from '@core/interfaces/social-user';
import { UserProvider } from '@features/user/providers/user-provider';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleProvider {
  constructor(
    /**
     * @description user service
     */
    private readonly userService: UserService,
    /**
     * @description user provider to create social user
     */
    private readonly userProvider: UserProvider,

    private readonly authService: AuthService,
  ) {}

  async validateOrCreateUser(googleUser: SocialUser) {
    const { email } = googleUser;
    const user = await this.userService.findByEmail(email);
    try {
      if (user) {
        await this.userService.update(user.id, googleUser);
        const tokens = await this.authService.generateTokens({
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        });
        return { user, ...tokens };
      } else {
        const { socialUser } =
          await this.userProvider.createSocialUser(googleUser);
        const tokens = await this.authService.generateTokens({
          sub: socialUser.id,
          email: socialUser.email,
          username: socialUser.username,
          role: socialUser.role,
        });
        return { user: socialUser, ...tokens };
      }
    } catch (error) {
      throw new RequestTimeoutException(error.message);
    }
  }
}
