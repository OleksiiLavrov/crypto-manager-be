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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Coin, (coin) => coin.transactions)
  coin: Coin;
}
