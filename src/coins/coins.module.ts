import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Transaction } from 'src/transactions/transactions.model';

import { CoinsController } from './coins.controller';
import { Coin } from './coins.model';
import { CoinsService } from './coins.service';

@Module({
  controllers: [CoinsController],
  providers: [CoinsService],
  imports: [SequelizeModule.forFeature([Coin, Transaction])],
})
export class CoinsModule {}
