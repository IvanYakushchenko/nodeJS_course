import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('discounts')
export class Discount {
  @PrimaryColumn()
  code: string;

  @Column('int')
  percent: number;
}