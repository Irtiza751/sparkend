import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GoogleProvider } from '../provider/google-provider';
import { AuthProvider } from '@/features/user/enums/auth-provider';
import { SocialUser } from '../../../interfaces/social-user';
import { UserRoles } from '../../role/enums/user-role.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    /**
     * @description google provider
     */
    private readonly googleProvider: GoogleProvider,
    /**
     * @description auth configs
     */
    @Inject(jwtConfig.KEY)
    readonly authConfig: ConfigType<typeof jwtConfig>,
  ) {
    super({
      clientID: authConfig.googleClientId,
      clientSecret: authConfig.googleClientSecret,
      callbackURL: authConfig.googleCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    Logger.log(accessToken, 'accessToken');
    Logger.log(refreshToken, 'refreshToken');
    Logger.log(profile, 'profile');
    const user: SocialUser = {
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,
      email: profile.emails?.[0]?.value || '',
      username: profile.username || '',
      avatar: profile.photos?.[0]?.value || '',
      verified: profile.emails?.[0]?.verified || false,
      role: UserRoles.USER,
      accessToken,
    };
    // this will add the user in the request object.
    done(null, user);
  }
}
