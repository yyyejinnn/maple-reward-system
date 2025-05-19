import { UserRole } from '@app/common/enums/user-role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, type: String, default: UserRole.USER })
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
