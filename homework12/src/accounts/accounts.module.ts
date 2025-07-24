import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Movement } from './movement.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Movement])],
  providers: [TransferService],
  controllers: [TransferController],
})
export class AccountsModule {}