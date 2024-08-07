export class FileCreatedEvent {
  file: Express.Multer.File;

  constructor(file: Express.Multer.File) {
    this.file = file;
  }
}
