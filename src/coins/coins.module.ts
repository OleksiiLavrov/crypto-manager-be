import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { Coin } from './entity/coin.entity';
import { QuotesProcessor } from './processors/quotes.processor';

@Module({
  imports: [TypeOrmModule.forFeature([Coin]), HttpModule],
  providers: [CoinsService, QuotesProcessor],
  exports: [CoinsService],
  controllers: [CoinsController],
})
export class CoinsModule {}
