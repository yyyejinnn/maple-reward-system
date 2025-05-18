import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, EVENT_SERVICE } from '@app/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@app/common/exception-filters/http.exception-filter';
import { RpcClientService } from './rpc-client.service';
import { HttpResponseInterceptor } from '@app/common/interceptors/http.response.interceptor';
import { LocalStrategy } from './passport/local/local.strategy';
import { JwtStrategy } from './passport/jwt/jwt.strategy';
import { RolesGuard } from './role/role.guard';

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
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    GatewayService,
    RpcClientService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class GatewayModule {}
