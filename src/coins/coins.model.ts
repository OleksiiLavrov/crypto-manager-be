import { ApiProperty } from '@nestjs/swagger';

import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { CoinTransactions } from 'src/transactions/coin-transactions.model';
import { Transaction } from 'src/transactions/transactions.model';

interface CoinCreationAttrs {
  name: string;
  total_amount: number;
  total_invested: number;
}

@Table({ tableName: 'coins' })
export class Coin extends Model<Coin, CoinCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identificator' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'APT', description: 'Coin name' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 10, description: 'Amount of these coins' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_amount: number;

  @ApiProperty({
    example: 500,
    description: 'Total amount of money spended on buying this coin',
  })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_invested: number;

  @BelongsToMany(() => Transaction, () => CoinTransactions)
  transactions: Transaction[];
}
