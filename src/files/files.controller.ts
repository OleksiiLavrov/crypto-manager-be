import { Controller, Delete, Param } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Delete(':key')
  delete(@Param('key') key: string) {
    return this.filesService.delete(key);
  }
}
