import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Discount } from './discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async createWithRetry(code: string, percent: number): Promise<Discount> {
    let attempt = 0;
    let delay = 100;

    while (attempt < 3) {
      attempt++;
      try {
        return await this.manager.connection.transaction(
          'SERIALIZABLE',
          async (trx) => {
            const existing = await trx.findOne(Discount, { where: { code } });
            if (existing) {
              return existing;
            }

            const newDiscount = trx.create(Discount, { code, percent });
            return await trx.save(newDiscount);
          },
        );
      } catch (err: any) {
        if (err.code === '40001') {
          console.log(`retry #${attempt} after error 40001`);
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
          continue;
        }
        throw err;
      }
    }

    throw new Error('Could not create discount after 3 retries');
  }
}