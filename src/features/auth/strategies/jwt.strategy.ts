import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtPayload } from '@/interfaces/jwt-payload.interface';

/**
 * @description
 * The JWT strategy is used to validate jwt tokens
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    /**
     * @description inject auth service to validate the user
     */
    private readonly authService: AuthService,
    /**
     * @description inject jwt config service to get secerets
     */
    @Inject(jwtConfig.KEY)
    jwtConfigService: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.jwtAccessSecret!,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.authService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
