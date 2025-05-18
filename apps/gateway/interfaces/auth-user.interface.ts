import { UserRole } from '@app/common/enums/user-role.enum';

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
}
