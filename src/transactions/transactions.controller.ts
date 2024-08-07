import {
  Body,
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { TransactionDto } from './dto/transaction.dto';

import { Transaction } from './transactions.schema';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: TransactionDto): Promise<Transaction> {
    return this.transactionsService.add(createTransactionDto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  parse(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.transactionsService.parse(file);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: TransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.update(id, updateTransactionDto);
  }
}
