import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Transaction {
  @Prop({ required: true })
  coin_amount: number;

  @Prop({ required: true })
  total_cost: number;

  @Prop({ required: true })
  coin_name: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
