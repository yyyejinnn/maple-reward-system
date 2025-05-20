import { UserRole } from '@app/common/enums/user-role.enum';
import { IS_PUBLIC_KEY, ROLES_KEY } from '@app/common/tokens/decorator.keys';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 2-1. 인증된 사용자만 접근 가능
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    const userRole = user.role;

    // 2-2. AUDITOR은 default 전역 차단
    const isAuditor = userRole === UserRole.AUDITOR;
    const isAllowedForAuditor = requiredRoles?.includes(UserRole.AUDITOR) ?? false;

    if (isAuditor && !isAllowedForAuditor) {
      return false;
    }

    if (!requiredRoles) {
      return true;
    }

    // 2-3. 그외 사용자
    return requiredRoles.some(role => userRole === role);
  }
}
