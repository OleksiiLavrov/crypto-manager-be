import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('coin')
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  marketCap: number;

  @Column()
  name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
