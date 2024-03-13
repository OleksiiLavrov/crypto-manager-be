import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type CoinDocument = HydratedDocument<Coin>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Coin {
  @Prop({ required: true })
  total_amount: number;

  @Prop({ required: true })
  total_invested: number;

  @Prop({ required: true })
  name: string;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);
