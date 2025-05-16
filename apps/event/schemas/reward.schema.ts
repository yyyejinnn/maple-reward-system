import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: Types.ObjectId, required: true, ref: Event.name })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  type: string; // POINT, ITEM, COUPON

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ type: Object, default: {} })
  meta?: Record<string, any>;

  @Prop() // user._id
  createdBy: string;

  createdAt: Date;
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
