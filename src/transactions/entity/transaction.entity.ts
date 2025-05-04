import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoinToUser } from '../../coins/entity/coin-to-user.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coinId: number;

  @Column()
  userId: number;

  @Column()
  coinToUserId: number;

  @Column('float8')
  amount: number;

  @Column('float8')
  cost: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => CoinToUser, (coinToUser) => coinToUser.transactions)
  coinToUser: CoinToUser;
}
