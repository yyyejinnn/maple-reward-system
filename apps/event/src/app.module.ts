import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
import { RewardClaimModule } from './reward-claim/reward-claim.module';
import { APP_FILTER } from '@nestjs/core';
import { TcpExceptionFilter } from '@app/common/exception-filters/tcp.exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/event/.env.event',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    EventModule,
    RewardModule,
    RewardClaimModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: TcpExceptionFilter,
    },
  ],
})
export class EventAPPModule {}
