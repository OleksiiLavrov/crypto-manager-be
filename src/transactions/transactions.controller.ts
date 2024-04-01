import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { TransactionDto } from './dto/transaction.dto';

import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: TransactionDto) {
    return this.transactionsService.add(createTransactionDto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  parse(@UploadedFile() file) {
    return this.transactionsService.parse(file);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: TransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }
}
