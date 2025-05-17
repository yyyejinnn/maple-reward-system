import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, AuthPatterns } from '@app/common';

import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    // 옵저버 처리 필요 (컨트롤러는 자동 변환)
    const user = await lastValueFrom(
      this.authClient.send({ cmd: AuthPatterns.ValidateUser }, { email, password }),
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
