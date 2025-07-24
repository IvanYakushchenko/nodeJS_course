import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (a) => a.fromMovements, { onDelete: 'CASCADE' })
  from: Account;

  @ManyToOne(() => Account, (a) => a.toMovements, { onDelete: 'CASCADE' })
  to: Account;

  @Column('numeric')
  amount: number;

  @CreateDateColumn()
  created_at: Date;
}