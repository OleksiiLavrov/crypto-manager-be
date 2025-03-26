import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Coin } from './coin.entity';

@Entity('coin_to_user')
export class CoinToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  userId: number;

  @Column({ unique: false })
  coinId: number;

  @Column('float8')
  amount: number;

  @Column('float8')
  invested: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Coin, (coin) => coin.id)
  @JoinColumn({ name: 'coinId' })
  coin: Coin;

  @OneToMany(() => Transaction, (transaction) => transaction.coinToUser)
  transactions: Transaction[];
}
