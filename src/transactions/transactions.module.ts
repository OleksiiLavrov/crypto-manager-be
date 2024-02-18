import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Coin } from 'src/coins/coins.model';

import { CoinTransactions } from './coin-transactions.model';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transactions.model';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [SequelizeModule.forFeature([Transaction, Coin, CoinTransactions])],
})
export class TransactionsModule {}
