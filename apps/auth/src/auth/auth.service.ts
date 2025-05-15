import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'apps/auth/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateAccessTokenReqDto } from './dto/post.create-access-token.req.dto';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { ValidateUserReqDTO } from './dto/post.validate-user.req.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return `Auth! ${process.env.PORT}, ${process.env.MONGO_URI}`;
  }

  async register(dto: RegisterReqDTO) {
    const { email, password } = dto;

    // 유효성 체크
    const role = 'USER'; // 임시

    const user = new this.userModel({ email, password, role });
    await user.save();

    return { msg: '회원가입 성공' };
  }

  async validateUser(dto: ValidateUserReqDTO) {
    const { email, password: pwd } = dto;

    const user = await this.userModel.findOne({ email, password: pwd });

    if (user && user.password === pwd) {
      const { password, ...result } = user.toJSON();
      return result;
    }

    return null;
  }

  async createAccessToken(dto: CreateAccessTokenReqDto) {
    const payload = dto;
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
