import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, EVENT_SERVICE } from '@app/common';
import { RpcClientService } from './rpc-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'auth',
          port: 3001,
        },
      },
      {
        name: EVENT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'event',
          port: 3002,
        },
      },
    ]),
  ],
  providers: [RpcClientService],
  exports: [RpcClientService],
})
export class RpcClientModule {}
