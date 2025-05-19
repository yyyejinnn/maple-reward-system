import { Body, Controller, Get, NotFoundException, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthPatterns } from '@app/common';
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
}
