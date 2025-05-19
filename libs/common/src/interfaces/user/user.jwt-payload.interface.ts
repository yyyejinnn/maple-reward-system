import { BaseUser } from './user.base.interface';

export interface JwtPayload extends Pick<BaseUser, 'id' | 'email' | 'nickname' | 'role'> {}
