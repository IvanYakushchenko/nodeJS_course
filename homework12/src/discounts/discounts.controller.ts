import { Controller, Post, Body } from '@nestjs/common';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly service: DiscountsService) {}

  @Post()
  async create(@Body() dto: { code: string; percent: number }) {
    const discount = await this.service.createWithRetry(dto.code, dto.percent);
    return { success: true, data: discount };
  }
}