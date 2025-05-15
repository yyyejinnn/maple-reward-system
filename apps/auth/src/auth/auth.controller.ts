import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPatterns } from 'libs/constants/patterns/auth.patterns';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { CreateAccessTokenReqDto } from './dto/post.create-access-token.req.dto';
import { ValidateUserReqDTO } from './dto/post.validate-user.req.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthPatterns.Register })
  async register(@Payload() dto: RegisterReqDTO) {
    return await this.authService.register(dto);
  }

  @MessagePattern({ cmd: AuthPatterns.CreateAccessToken })
  async createAccessToken(@Payload() dto: CreateAccessTokenReqDto) {
    return this.authService.createAccessToken(dto);
  }

  @MessagePattern({ cmd: AuthPatterns.ValidateUser })
  async validateUser(@Payload() dto: ValidateUserReqDTO) {
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
