import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'apps/auth/src/auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'libs/constants/tokens/service.tokens';
import { AuthPatterns } from 'libs/constants/patterns/auth.patterns';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await firstValueFrom(
      this.authClient.send({ cmd: AuthPatterns.ValidateUser }, { email, password }),
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
