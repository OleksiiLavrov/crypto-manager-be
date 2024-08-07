import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsModule } from './coins/coins.module';
import { FilesModule } from './files/files.module';
import { ParserModule } from './parser/parser.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URI),
    TransactionsModule,
    CoinsModule,
    FilesModule,
    ParserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
