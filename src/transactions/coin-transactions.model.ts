import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Coin } from 'src/coins/coins.model';

import { Transaction } from './transactions.model';

@Table({ tableName: 'coin_transactions', createdAt: false, updatedAt: false })
export class CoinTransactions extends Model<CoinTransactions> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Coin)
  @Column({
    type: DataType.INTEGER,
  })
  coin_id: number;

  @ForeignKey(() => Transaction)
  @Column({
    type: DataType.INTEGER,
  })
  transaction_id: number;
}
