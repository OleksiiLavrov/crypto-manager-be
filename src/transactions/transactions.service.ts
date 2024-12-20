import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import mongoose, { ClientSession, Model } from 'mongoose';

import { CoinsService } from 'src/coins/coins.service';
import { AddCoinDto } from 'src/coins/dto/add-coin.dto';
import { ParserService } from 'src/parser/parser.service';
import { dbTransaction } from 'src/util/db-transaction';

import { TransactionDto } from './dto/transaction.dto';

import { Transaction, TransactionDocument } from './transactions.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionsModel: Model<Transaction>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly coinsService: CoinsService,
    private readonly parserService: ParserService,
  ) {}

  private async createTransaction(
    createTransactionDto: TransactionDto,
    session: ClientSession,
  ) {
    try {
      const createdTransaction = new this.transactionsModel(
        createTransactionDto,
      );
      return createdTransaction.save({ session });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating the transaction',
        error,
      });
    }
  }

  private async createManyTransactions(
    createTransactionDtos: TransactionDto[],
    session: ClientSession,
  ) {
    try {
      const createdTransactions = await this.transactionsModel.insertMany(
        createTransactionDtos,
        { session },
      );
      return createdTransactions;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating transactions',
        error,
      });
    }
  }

  private async updateTransaction(
    updateTransactionDto: TransactionDto,
    transaction: TransactionDocument,
    session: ClientSession,
  ) {
    const { coin_name, coin_amount, total_cost } = updateTransactionDto;
    try {
      transaction.coin_amount = coin_amount;
      transaction.coin_name = coin_name;
      transaction.total_cost = total_cost;
      return await transaction.save({ session });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during updating the transaction',
        error,
      });
    }
  }

  public async add(createTransactionDto: TransactionDto): Promise<Transaction> {
    return dbTransaction<Transaction>(this.connection, async (session) => {
      const coin = await this.coinsService.add(
        {
          name: createTransactionDto.coin_name,
          add_amount: createTransactionDto.coin_amount,
          add_invested: createTransactionDto.total_cost,
        },
        session,
      );
      const transaction = await this.createTransaction(
        createTransactionDto,
        session,
      );
      await coin.updateOne({
        $push: {
          transactions: transaction._id,
        },
      });
      return transaction;
    });
  }

  public async update(
    id: string,
    updateTransactionDto: TransactionDto,
  ): Promise<Transaction> {
    return dbTransaction<Transaction>(this.connection, async (session) => {
      const transaction = await this.transactionsModel.findById(id);
      const updatedCoinDto: AddCoinDto = {
        name: updateTransactionDto.coin_name,
        add_amount: -transaction.coin_amount + updateTransactionDto.coin_amount,
        add_invested: -transaction.total_cost + updateTransactionDto.total_cost,
      };
      await this.coinsService.add(updatedCoinDto, session);
      return await this.updateTransaction(
        updateTransactionDto,
        transaction,
        session,
      );
    });
  }

  public async parse(file: Express.Multer.File): Promise<Transaction[][]> {
    const transactionsPerCoin = this.parserService.parseXlsxTable(file);
    const transactionsPromise = Object.keys(transactionsPerCoin).map(
      async (coinName) => {
        return dbTransaction<Transaction[]>(
          this.connection,
          async (session) => {
            const { coin_amount, total_cost, transactions } =
              transactionsPerCoin[coinName];
            const coin = await this.coinsService.add(
              {
                name: coinName,
                add_amount: coin_amount,
                add_invested: total_cost,
              },
              session,
            );
            const createdTransactions = await this.createManyTransactions(
              transactions,
              session,
            );
            await coin.updateOne({
              $push: {
                transactions: { $each: createdTransactions.map((t) => t._id) },
              },
            });
            return createdTransactions;
          },
        );
      },
    );
    return Promise.all(transactionsPromise);
  }

  public async getTransactionsPerCoin(
    coinName: string,
  ): Promise<Transaction[]> {
    try {
      const coin =
        await this.coinsService.findOneByNameWithTransactions(coinName);
      if (!coin) return [];
      const transactions = await this.transactionsModel.find({
        _id: { $in: coin.transactions },
      });
      return transactions;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error fetching transactions for the coin',
        error,
      });
    }
  }
}
