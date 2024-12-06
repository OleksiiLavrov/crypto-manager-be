import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transaction } from 'src/transactions/entity/transaction.entity';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float8')
  totalAmount: number;

  @Column('float8')
  totalInvested: number;

  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.coin)
  transactions: Transaction[];
}
