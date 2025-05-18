import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'apps/auth/src/schemas/user.schema';
import { Model } from 'mongoose';
import { ValidateUserPayloadDto } from './dto/validate-user.payload.dto';
import { CreateAccessTokenPayloadDto } from './dto/create-access-token.payload.dto';
import { RegisterPayloadDto } from './dto/register.payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return `Auth! ${process.env.PORT}, ${process.env.MONGO_URI}`;
  }

  async register(dto: RegisterPayloadDto) {
    const { email, nickname, password, role } = dto;

    // 유효성 체크
    // const role = 'USER'; // 임시

    const user = new this.userModel({ email, nickname, password, role });
    await user.save();

    return { msg: '회원가입 성공' };
  }

  async validateUser(dto: ValidateUserPayloadDto) {
    const { email, password: pwd } = dto;

    const user = await this.userModel.findOne({ email, password: pwd });

    if (user && user.password === pwd) {
      const { password, ...result } = user.toJSON();
      return result;
    }

    return null;
  }

  async createAccessToken(dto: CreateAccessTokenPayloadDto) {
    const payload = dto;
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
