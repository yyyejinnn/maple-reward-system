import { BaseSchema } from '@app/common/interfaces/base-schema';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop(
    raw({
      type: { type: String, required: true },
      criteria: { type: Object, required: true },
      _id: false,
    }),
  )
  condition: {
    type: string;
    criteria: Record<string, any>;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop(
    raw({
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      _id: false,
    }),
  )
  period: {
    start: Date;
    end: Date;
  };

  @Prop() // user._id
  createdBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
