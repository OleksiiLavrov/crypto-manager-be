import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsModule } from 'src/coins/coins.module';
import { ParserModule } from 'src/parser/parser.module';

import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './transactions.schema';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    CoinsModule,
    ParserModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
