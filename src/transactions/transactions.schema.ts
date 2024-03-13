import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Transaction {
  @Prop({ required: true })
  coin_amount: number;

  @Prop({ required: true })
  total_cost: number;

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coin', required: true })
  //   coin : Coin;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
