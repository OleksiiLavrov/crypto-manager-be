import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileCreatedListener } from './listeners/file-created.listener';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileCreatedListener],
  exports: [FilesService],
})
export class FilesModule {}
