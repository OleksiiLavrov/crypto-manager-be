import {
  Body,
  Controller, // FileTypeValidator,
  // Get,
  Param, // ParseFilePipe,
  Post,
  Put, // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';

// import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';

import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // upload(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType:
  //             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.transactionsService.parse(file);
  // }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: TransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.update(+id, updateTransactionDto);
  }
}
