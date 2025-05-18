import {
  AUTH_SERVICE,
  AuthPatterns,
  EVENT_SERVICE,
  EventPatterns,
  RewardClaimPatterns,
  RewardPatterns,
} from '@app/common';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Injectable()
export class RpcClientService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(EVENT_SERVICE) private readonly eventClient: ClientProxy,
  ) {}

  async send(
    pattern: AuthPatterns | EventPatterns | RewardPatterns | RewardClaimPatterns,
    payload: any,
    server: 'auth' | 'event',
  ) {
    const client = this.getClient(server);

    return await lastValueFrom(
      client.send({ cmd: pattern }, payload).pipe(
        catchError(err => {
          return throwError(
            () =>
              new HttpException(err.message, err?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }),
      ),
    );
  }

  private getClient(server: 'auth' | 'event'): ClientProxy {
    switch (server) {
      case 'auth':
        return this.authClient;
      case 'event':
        return this.eventClient;
    }
  }
}
