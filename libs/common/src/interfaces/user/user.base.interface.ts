import { UserRole } from '@app/common/enums/user-role.enum';

// extends User
export interface BaseUser {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
}
