import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoinsModule } from './coins/coins.module';
import { dataSourceOptions } from './config/data-source';
import { FilesModule } from './files/files.module';
import { ParserModule } from './parser/parser.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow('UPLOAD_RATE_TTL'),
          limit: config.getOrThrow('UPLOAD_RATE_LIMIT'),
        },
      ],
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    TransactionsModule,
    CoinsModule,
    FilesModule,
    ParserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
