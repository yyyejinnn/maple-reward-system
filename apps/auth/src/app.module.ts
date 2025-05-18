import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { TcpExceptionFilter } from '@app/common/exception-filters/tcp.exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/auth/.env.auth',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: TcpExceptionFilter,
    },
  ],
})
export class AuthAPPModule {}
