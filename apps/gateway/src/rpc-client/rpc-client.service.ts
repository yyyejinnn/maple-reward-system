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
import { catchError, defaultIfEmpty, lastValueFrom, throwError, timeout } from 'rxjs';

type Patterns = AuthPatterns | EventPatterns | RewardPatterns | RewardClaimPatterns;
type Servers = 'auth' | 'event';

const AUTH_PATTERNS = Object.values(AuthPatterns) as string[];
const EVENT_PATTERNS = [
  ...Object.values(EventPatterns),
  ...Object.values(RewardPatterns),
  ...Object.values(RewardClaimPatterns),
] as string[];

@Injectable()
export class RpcClientService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(EVENT_SERVICE) private readonly eventClient: ClientProxy,
  ) {}

  async send(pattern: Patterns, payload: any, server: Servers) {
    this.validatePattern(pattern, server);

    return await lastValueFrom(
      this.getClient(server)
        .send({ cmd: pattern }, payload)
        .pipe(
          timeout(5000),
          defaultIfEmpty({
            message: '요청 성공',
          }),
          catchError(err => {
            return throwError(
              () =>
                new HttpException(err.message, err?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR),
            );
          }),
        ),
    );
  }

  private validatePattern(pattern: Patterns, server: Servers) {
    if (server === 'auth' && !AUTH_PATTERNS.includes(pattern)) {
      throw new HttpException(
        `Auth 서버에 유효하지 않은 pattern 입니다.(${pattern})`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (server === 'event' && !EVENT_PATTERNS.includes(pattern)) {
      throw new HttpException(
        `Event 서버에 유효하지 않은 pattern 입니다.(${pattern})`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getClient(server: Servers): ClientProxy {
    switch (server) {
      case 'auth':
        return this.authClient;
      case 'event':
        return this.eventClient;
    }
  }
}
