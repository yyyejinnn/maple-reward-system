import { UserRole } from '@app/common/enums/user-role.enum';
import { ROLES_KEY } from '@app/common/tokens/decorator.keys';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
