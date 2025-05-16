import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPatterns } from 'libs/constants/patterns/auth.patterns';
import { ValidateUserPayloadDto } from './dto/validate-user.payload.dto';
import { CreateAccessTokenPayloadDto } from './dto/create-access-token.payload.dto';
import { RegisterPayloadDto } from './dto/register.payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthPatterns.Register })
  async register(@Payload() dto: RegisterPayloadDto) {
    return await this.authService.register(dto);
  }

  @MessagePattern({ cmd: AuthPatterns.CreateAccessToken })
  async createAccessToken(@Payload() dto: CreateAccessTokenPayloadDto) {
    return this.authService.createAccessToken(dto);
  }

  @MessagePattern({ cmd: AuthPatterns.ValidateUser })
  async validateUser(@Payload() dto: ValidateUserPayloadDto) {
    return this.authService.validateUser(dto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // async login(@Request() req) {
  //   const { user } = req; // deco 수정예정

  //   return this.authService.login(user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('test')
  // @MessagePattern({ cmd: 'test' })
  // async test() {
  //   return 'pong';
  // }
}
