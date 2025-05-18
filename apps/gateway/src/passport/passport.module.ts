import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RpcClientModule } from '../rpc-client/rpc-client.module';

@Module({
  imports: [RpcClientModule],
  providers: [LocalStrategy, JwtStrategy],
  exports: [LocalStrategy, JwtStrategy],
})
export class AuthPassportModule {}
