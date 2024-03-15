import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Coin, CoinSchema } from './coins.schema';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
  providers: [CoinsService],
  exports: [
    CoinsService,
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
  controllers: [CoinsController],
})
export class CoinsModule {}
