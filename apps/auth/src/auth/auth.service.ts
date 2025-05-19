import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'apps/auth/src/schemas/user.schema';
import { Model } from 'mongoose';
import { ValidateUserPayloadDto } from './dto/validate-user.payload.dto';
import { CreateAccessTokenPayloadDto } from './dto/create-access-token.payload.dto';
import { RegisterPayloadDto } from './dto/register.payload.dto';
import { RpcException } from '@nestjs/microservices';
import { BaseUser, JwtPayload } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterPayloadDto) {
    const { email, nickname, password, role } = dto;

    // 유효성 체크
    const existing = await this.userModel.findOne({
      $or: [{ email }, { nickname }],
    });

    if (existing) {
      if (existing.email === email) {
        throw new RpcException('이미 존재하는 email 입니다.');
      }
      if (existing.nickname === nickname) {
        throw new RpcException('이미 존재하는 nickname 입니다.');
      }
    }

    const user = new this.userModel({
      email,
      nickname,
      password: this.hashPassword(password),
      role,
    });
    await user.save();
  }

  private hashPassword(pwd: string) {
    // pwd 암호화 logic...

    return pwd; // 암호화된 pwd
  }

  async validateUser(dto: ValidateUserPayloadDto) {
    const { email, password: pwd } = dto;

    // 유효성 체크
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new RpcException('가입되지않은 email 입니다.');
    }

    if (user.password !== pwd) {
      throw new RpcException('비밀번호가 일치하지않습니다.');
    }

    const { password, ...result } = user.toJSON();
    return result;
  }

  async createAccessToken(dto: CreateAccessTokenPayloadDto) {
    const payload = this.getPayload(dto);

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private getPayload(user: BaseUser): JwtPayload {
    const { id, email, nickname, role } = user;

    return {
      id,
      email,
      nickname,
      role,
    };
  }
}
