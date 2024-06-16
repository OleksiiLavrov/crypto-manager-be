import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsModule } from './coins/coins.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_CONNECTION_URI ||
        'mongodb+srv://lavovalexey:X6k68DRBTJXN6SpI@crypto-manager.medqd2e.mongodb.net/crypto_manager_dev',
    ),
    TransactionsModule,
    CoinsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
