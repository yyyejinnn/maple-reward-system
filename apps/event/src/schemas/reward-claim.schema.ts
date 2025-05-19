import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Reward } from './reward.schema';
import { RewardClaimProgress } from '@app/common';
import { BaseSchema } from '@app/common/interfaces/base-schema';

export type RewardClaimDocument = HydratedDocument<RewardClaim>;

@Schema({ timestamps: true })
export class RewardClaim extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: Reward.name })
  rewardId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  userNickname: string;

  @Prop({
    required: true,
    enum: RewardClaimProgress,
    type: String,
    default: RewardClaimProgress.PENDING,
  })
  progress: RewardClaimProgress;

  @Prop()
  confirmedBy?: string; // 수동 확인 시

  @Prop()
  confirmedAt?: Date;
}

export const RewardClaimSchema = SchemaFactory.createForClass(RewardClaim);

// 중복 요청 방지
RewardClaimSchema.index({ rewardId: 1, userId: 1 }, { unique: true });
