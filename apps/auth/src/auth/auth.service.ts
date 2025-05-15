import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    return `Auth! ${process.env.PORT}, ${process.env.MONGO_URI}`;
  }
}
