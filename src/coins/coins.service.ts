import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CoinDto, CoinWithQuotesDto } from './dto/coin.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';

import { Coin } from './entity/coin.entity';
import { QuotesProcessor } from './processors/quotes.processor';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinsRepository: Repository<Coin>,
    private readonly quotesProcessor: QuotesProcessor,
  ) {}

  public async createCoin(createCoinDto: CreateCoinDto): Promise<CoinDto> {
    const { name, addAmount, addInvested } = createCoinDto;
    try {
      const coin = this.coinsRepository.create({
        totalInvested: addInvested,
        totalAmount: addAmount,
        name: name,
      });

      return await this.coinsRepository.save(coin);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating the coin',
        error,
      });
    }
  }

  public async updateCoin(
    updateCoinDto: UpdateCoinDto,
    coin: CoinDto,
  ): Promise<CoinDto> {
    const { addAmount, addInvested } = updateCoinDto;
    try {
      coin.totalAmount += addAmount;
      coin.totalInvested += addInvested;
      return await this.coinsRepository.save(coin);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during updating the coin',
        error,
      });
    }
  }

  public async findAll(): Promise<CoinWithQuotesDto[]> {
    try {
      const coins = await this.coinsRepository.find();
      return await this.fillCoinDataWithQuotes(coins);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during finding all coins',
        error,
      });
    }
  }

  public async findOneByName(name: string): Promise<CoinDto> {
    try {
      const coin = await this.coinsRepository.findOne({ where: { name } });
      return coin;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during finding coin by name',
        error,
      });
    }
  }

  public async findOneByNameWithTransactions(name: string): Promise<CoinDto> {
    try {
      const coin = await this.coinsRepository
        .createQueryBuilder('coin')
        .leftJoinAndSelect('coin.transactions', 'transactions')
        .where('coin.name = :name', { name })
        .getOne();
      return coin;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during finding coin by name',
        error,
      });
    }
  }

  private async fillCoinDataWithQuotes(
    coins: CoinDto[],
  ): Promise<CoinWithQuotesDto[]> {
    const coinQuotes = await this.quotesProcessor.getSelectedQuotes(coins);
    return coins.map((coin, index): CoinWithQuotesDto => {
      const { totalAmount, totalInvested } = coin;
      const totalValue = totalAmount * coinQuotes[index].price;
      const pnl =
        ((totalValue - totalInvested) / Math.abs(totalInvested)) * 100;
      const avg = totalInvested / totalAmount;
      return {
        ...coinQuotes[index],
        ...coin,
        totalValue,
        pnl,
        avg,
      };
    });
  }
}
