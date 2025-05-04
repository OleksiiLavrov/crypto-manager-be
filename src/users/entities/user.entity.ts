import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoinToUser } from '../../coins/entity/coin-to-user.entity';
import { UserRole } from '../enum/user-role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

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
