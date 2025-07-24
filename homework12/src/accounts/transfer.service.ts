import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Account } from './account.entity';
import { Movement } from './movement.entity';

@Injectable()
export class TransferService {
  constructor(private readonly dataSource: DataSource) {}

  async transfer(fromId: string, toId: string, amount: number) {
    return this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Account, { where: { id: fromId } });
      const to = await manager.findOne(Account, { where: { id: toId } });

      if (!from || !to) {
        throw new BadRequestException('Account not found');
      }

      const fromBalance = Number(from.balance);
      if (fromBalance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      from.balance = (fromBalance - amount).toString();
      to.balance = (Number(to.balance) + amount).toString();

      await manager.save([from, to]);

      const movement = manager.create(Movement, { from, to, amount });
      await manager.save(movement);

      return movement;
    });
  }
}