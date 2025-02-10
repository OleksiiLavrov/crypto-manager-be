import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoinsService } from 'src/coins/coins.service';
import { UpdateCoinToUserDto } from 'src/coins/dto/update-coin-to-user.dto';
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
  ) {}

  public async create(
    createTransactionDto: CreateTransactionDto,
    userId: number,
  ): Promise<TransactionDto> {
    let coin = await this.coinsService.findCoinByName(
      createTransactionDto.coinName,
    );

    let userCoin = await this.coinsService.findUserCoinByName(
      createTransactionDto.coinName,
      userId,
    );

    const queryRunner =
      this.transactionsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!coin) {
        coin = await this.coinsService.createCoin({
          name: createTransactionDto.coinName,
          price: null,
          marketCap: null,
        });
      }

      if (!userCoin) {
        userCoin = await this.coinsService.createUserCoin({
          coinId: coin.id,
          userId,
          amount: createTransactionDto.coinAmount,
          invested: createTransactionDto.totalCost,
        });
      } else {
        const updatedUserCoinDto: UpdateCoinToUserDto = {
          id: userCoin.id,
          coinId: coin.id,
          userId,
          amount: userCoin.amount + createTransactionDto.coinAmount,
          invested: userCoin.invested + createTransactionDto.totalCost,
        };

        await this.coinsService.updateUserCoin(updatedUserCoinDto);
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
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const queryRunner =
      this.transactionsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userCoin = await this.coinsService.findUserCoinByName(
      updateTransactionDto.coinName,
      userId,
    );

    try {
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id },
      });

      const updatedUserCoinDto: UpdateCoinToUserDto = {
        ...userCoin,
        userId,
        amount:
          userCoin.amount -
          transaction.amount +
          updateTransactionDto.coinAmount,
        invested:
          userCoin.invested - transaction.cost + updateTransactionDto.totalCost,
      };

      await this.coinsService.updateUserCoin(updatedUserCoinDto);

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
      transaction.amount = coinAmount;
      transaction.cost = totalCost;
      return await this.transactionsRepository.save(transaction);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during updating the transaction',
        error,
      });
    }
  }
}