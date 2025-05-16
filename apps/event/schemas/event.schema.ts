import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop(
    raw({
      type: { type: String, required: true },
      criteria: { type: Object, required: true },
    }),
  )
  condition: {
    type: string;
    criteria: Record<string, any>;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      start: { type: Date },
      end: { type: Date },
    },
    required: true,
  })
  period: {
    start: Date;
    end: Date;
  };

  @Prop() // user._id
  createdBy: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
