import { Controller, Get } from '@nestjs/common';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('account-info')
  async getAccountInfo() {
    const accountInfo = await this.binanceService.getAccountInfo();
    return accountInfo.data();
  }
}
