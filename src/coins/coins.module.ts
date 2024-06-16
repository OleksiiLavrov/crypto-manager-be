import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsController } from './coins.controller';
import { Coin, CoinSchema } from './coins.schema';
import { CoinsService } from './coins.service';
import { QuotesProcessor } from './processors/quotes.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
    HttpModule,
  ],
  providers: [CoinsService, QuotesProcessor],
  exports: [
    CoinsService,
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
  controllers: [CoinsController],
})
export class CoinsModule {}
