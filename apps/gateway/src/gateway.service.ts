import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  getHello(): string {
    return `GW! ${process.env.PORT}`;
  }
}
