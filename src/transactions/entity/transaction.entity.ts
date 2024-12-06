import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Coin } from 'src/coins/entity/coin.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coinId: number;

  @Column('float8')
  coinAmount: number;

  @Column('float8')
  totalCost: number;

  @Column()
  coinName: string;

  @ManyToOne(() => Coin, (coin) => coin.transactions)
  coin: Coin;
}
