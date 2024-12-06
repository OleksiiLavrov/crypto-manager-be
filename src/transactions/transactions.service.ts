import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CoinsService } from 'src/coins/coins.service';
import { UpdateCoinDto } from 'src/coins/dto/update-coin.dto';
import { ParserService } from 'src/parser/parser.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly coinsService: CoinsService,
    private readonly parserService: ParserService,
  ) {}

  private async createTransaction(
    coinId: number,
    createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const transaction = this.transactionsRepository.create({
        coinId: coinId,
        ...createTransactionDto,
      });
      return await this.transactionsRepository.save(transaction);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating the transaction',
        error,
      });
    }
  }

  private async createManyTransactions(
    coinId: number,
    createTransactionDtos: CreateTransactionDto[],
  ) {
    try {
      const transactions = this.transactionsRepository.create(
        createTransactionDtos.map((dto) => ({
          coinId: coinId,
          ...dto,
        })),
      );
      return await this.transactionsRepository.save(transactions);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating transactions',
        error,
      });
    }
  }

  private async updateTransaction(
    updateTransactionDto: UpdateTransactionDto,
    transaction: Transaction,
  ) {
    const { coinAmount, totalCost } = updateTransactionDto;
    try {
      transaction.coinAmount = coinAmount;
      transaction.totalCost = totalCost;
      return await this.transactionsRepository.save(transaction);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during updating the transaction',
        error,
      });
    }
  }

  public async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    let coin = await this.coinsService.findOneByName(
      createTransactionDto.coinName,
    );

    const queryRunner =
      this.transactionsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!coin) {
        coin = await this.coinsService.createCoin({
          name: createTransactionDto.coinName,
          addAmount: createTransactionDto.coinAmount,
          addInvested: createTransactionDto.totalCost,
        });
      } else {
        const updatedCoinDto: UpdateCoinDto = {
          addAmount: createTransactionDto.coinAmount,
          addInvested: createTransactionDto.totalCost,
        };

        await this.coinsService.updateCoin(updatedCoinDto, coin);
      }

      const transaction = await this.createTransaction(
        coin.id,
        createTransactionDto,
      );

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const queryRunner =
      this.transactionsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const coin = await this.coinsService.findOneByName(
      updateTransactionDto.coinName,
    );

    try {
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id },
      });

      const updatedCoinDto: UpdateCoinDto = {
        addAmount: -transaction.coinAmount + updateTransactionDto.coinAmount,
        addInvested: -transaction.totalCost + updateTransactionDto.totalCost,
      };

      await this.coinsService.updateCoin(updatedCoinDto, coin);
      const result = await this.updateTransaction(
        updateTransactionDto,
        transaction,
      );

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // public async parse(file: Express.Multer.File): Promise<TransactionDto[][]> {
  //   const transactionsPerCoin = this.parserService.parseXlsxTable(file);
  //   const transactionsPromise = Object.keys(transactionsPerCoin).map(
  //     async (coinName) => {
  //       const queryRunner =
  //         this.transactionsRepository.manager.connection.createQueryRunner();
  //       await queryRunner.connect();
  //       await queryRunner.startTransaction();

  //       try {
  //         const { coinAmount, totalCost, transactions } =
  //           transactionsPerCoin[coinName];
  //         const coin = await this.coinsService.add({
  //           name: coinName,
  //           addAmount: coinAmount,
  //           addInvested: totalCost,
  //         });

  //         const createdTransactions =
  //           await this.createManyTransactions(transactions);

  //         // Update coin's transactions relation
  //         coin.transactions = [
  //           ...(coin.transactions || []),
  //           ...createdTransactions,
  //         ];
  //         await queryRunner.manager.save(coin);

  //         await queryRunner.commitTransaction();
  //         return createdTransactions;
  //       } catch (error) {
  //         await queryRunner.rollbackTransaction();
  //         throw error;
  //       } finally {
  //         await queryRunner.release();
  //       }
  //     },
  //   );
  //   return Promise.all(transactionsPromise);
  // }
}
