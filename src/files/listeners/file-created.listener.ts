import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FileCreatedEvent } from '../events/file-created.event';
import { FilesService } from '../files.service';

@Injectable()
export class FileCreatedListener {
  constructor(private readonly filesService: FilesService) {}

  @OnEvent('file.created', { async: true })
  handleOrderCreatedEvent(payload: FileCreatedEvent) {
    this.filesService.uploadCreatedFile(payload.file);
  }
}
