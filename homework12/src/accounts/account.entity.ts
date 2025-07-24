import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Check } from 'typeorm';
import { Movement } from './movement.entity';

@Check(`"balance" >= 0`)
@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { default: 0 })
  balance: string;

  @OneToMany(() => Movement, (m) => m.from)
  fromMovements: Movement[];

  @OneToMany(() => Movement, (m) => m.to)
  toMovements: Movement[];
}