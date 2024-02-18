import { ApiProperty } from '@nestjs/swagger';

import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { Coin } from 'src/coins/coins.model';

interface TransactionCreationAttrs {
  coin_price: number;
  coin_amount: number;
  total_cost: number;
}

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction, TransactionCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identificator' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 10,
    description: 'Coin price while doing transaction',
  })
  coin_price: number;

  @ApiProperty({
    example: 100,
    description: 'Amount of coins',
  })
  coin_amount: number;

  @ApiProperty({
    example: 1000,
    description: 'Total amount of money spended on buying this coin',
  })
  total_cost: number;

  @BelongsTo(() => Coin, 'coin_id')
  coin: Coin;
}
