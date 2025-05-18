import { UserRole } from '@app/common/enums/user-role.enum';

export class RegisterPayloadDto {
  email: string;
  nickname: string;
  password: string;
  role: UserRole;
}
