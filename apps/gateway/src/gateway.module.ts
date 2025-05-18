import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@app/common/exception-filters/http.exception-filter';
import { HttpResponseInterceptor } from '@app/common/interceptors/http.response.interceptor';
import { RpcClientModule } from './rpc-client/rpc-client.module';
import { AuthPassportModule } from './passport/passport.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/gateway/.env.gateway',
    }),
    RpcClientModule,
    AuthPassportModule,
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

    GatewayService,
  ],
})
export class GatewayModule {}
