import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPatterns } from '@app/common';
import { RpcClientService } from '../../rpc-client/rpc-client.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private rpcClientService: RpcClientService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.rpcClientService.send(
        AuthPatterns.ValidateUser,
        { email, password },
        'auth',
      );

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
