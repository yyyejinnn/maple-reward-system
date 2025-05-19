import { AuthUser, JwtPayload, UserRole } from '@app/common';

export class CreateAccessTokenPayloadDto implements JwtPayload {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
}
