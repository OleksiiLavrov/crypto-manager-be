import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoinToUser } from 'src/coins/entity/coin-to-user.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => CoinToUser, (coinToUser) => coinToUser.user)
  coins: CoinToUser[];
}
