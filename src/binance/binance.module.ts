import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';

@Module({
  controllers: [BinanceController],
  providers: [BinanceService, ConfigService],
})
export class BinanceModule {}
