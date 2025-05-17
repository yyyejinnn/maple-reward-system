import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, EVENT_SERVICE } from '@app/common';
import { LocalStrategy } from '../strategy/local.strategy';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/gateway/.env.gateway',
    }),

    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          // host: 'auth',
          host: '0.0.0.0',
          port: 3001,
        },
      },
      {
        name: EVENT_SERVICE,
        transport: Transport.TCP,
        options: {
          // host: 'event',
          host: '0.0.0.0',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, LocalStrategy, JwtStrategy],
})
export class GatewayModule {}
