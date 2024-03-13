import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Coin, CoinSchema } from './coins.schema';
import { CoinsService } from './coins.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
  providers: [CoinsService],
  exports: [
    CoinsService,
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
})
export class CoinsModule {}
