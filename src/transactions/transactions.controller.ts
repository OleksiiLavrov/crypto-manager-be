import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { TransactionDto } from './dto/transaction.dto';

import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: TransactionDto) {
    return this.transactionsService.add(createTransactionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: TransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }
}
