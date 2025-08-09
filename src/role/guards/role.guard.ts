import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRoles } from '../enums/user-role.enum';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!roles || roles.length <= 0) {
      throw new ForbiddenException();
    }

    const user = context.switchToHttp().getRequest().user as JwtPayload;
    Logger.log(user, roles);
    if (!user) throw new UnauthorizedException();

    return user.roles.some(role => roles.includes(role))
  }
}
