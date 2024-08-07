import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileCreatedListener } from './listeners/file-created.listener';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow('UPLOAD_RATE_TTL'),
          limit: config.getOrThrow('UPLOAD_RATE_LIMIT'),
        },
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    FileCreatedListener,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
