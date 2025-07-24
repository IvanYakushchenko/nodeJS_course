import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async transfer(@Body() body: { fromId: string; toId: string; amount: number }) {
    return this.transferService.transfer(body.fromId, body.toId, body.amount);
  }
}