import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { Transaction } from 'src/transactions/transactions.schema';

export type CoinDocument = HydratedDocument<Coin>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Coin {
  @Prop({ required: true })
  total_amount: number;

  @Prop({ required: true })
  total_invested: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }] })
  transactions: Transaction[];
}

export const CoinSchema = SchemaFactory.createForClass(Coin);
