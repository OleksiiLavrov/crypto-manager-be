import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateTransactionDto } from './dto/create-transaction.dto';

import { Transaction } from './transactions.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {}
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction =
      await this.transactionModel.create(createTransactionDto);
    return createdTransaction.save();
  }

  async findAll() {
    return `This action returns all transactions`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
