import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';

import { CoinsService } from 'src/coins/coins.service';
import { dbTransaction } from 'src/util/db-transaction';

import { CreateTransactionDto } from './dto/create-transaction.dto';

import { Transaction } from './transactions.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionsModel: Model<Transaction>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly coinsService: CoinsService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return dbTransaction<Transaction>(this.connection, async (session) => {
      await this.coinsService.add(
        {
          name: createTransactionDto.coin_name,
          add_amount: createTransactionDto.coin_amount,
          add_invested: createTransactionDto.total_cost,
        },
        session,
      );
      try {
        const createdTransaction = new this.transactionsModel(
          createTransactionDto,
        );
        return createdTransaction.save({ session });
      } catch (error) {
        throw new InternalServerErrorException({
          message: 'There was an error during creating transaction',
          error,
        });
      }
    });
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
