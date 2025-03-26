import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoinToUserDto, UserCoinWithQuotesDto } from './dto/coin-to-user.dto';
import { CoinDto } from './dto/coin.dto';
import { CreateCoinToUserDto } from './dto/create-coin-to-user.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinToUserDto } from './dto/update-coin-to-user.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { CoinToUser } from './entity/coin-to-user.entity';
import { Coin } from './entity/coin.entity';
import { QuotesProcessor } from './processors/quotes.processor';

@Injectable()
export class CoinsService {
  private readonly logger = new Logger(CoinsService.name);
  constructor(
    @InjectRepository(Coin)
    private readonly coinsRepository: Repository<Coin>,
    @InjectRepository(CoinToUser)
    private readonly coinToUserRepository: Repository<CoinToUser>,
    private readonly quotesProcessor: QuotesProcessor,
  ) {}

  public async createCoin(createCoinDto: CreateCoinDto): Promise<CoinDto> {
    const { name, price, marketCap } = createCoinDto;
    try {
      const coin = this.coinsRepository.create({
        price,
        marketCap,
        name,
      });

      return await this.coinsRepository.save(coin);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating the coin',
        error,
      });
    }
  }

  public async updateCoin(updateCoinDto: UpdateCoinDto): Promise<CoinDto> {
    const { price, marketCap } = updateCoinDto;
    try {
      const coin = await this.coinsRepository.findOne({
        where: { id: updateCoinDto.id },
      });
      coin.price = price;
      coin.marketCap = marketCap;
      return await this.coinsRepository.save(coin);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during updating the coin',
        error,
      });
    }
  }

  public async createUserCoin(
    createUserCoinDto: CreateCoinToUserDto,
  ): Promise<CoinToUserDto> {
    const { userId, amount, invested, coinId } = createUserCoinDto;

    const userCoin = this.coinToUserRepository.create({
      userId,
      coinId,
      amount,
      invested,
    });
    return await this.coinToUserRepository.save(userCoin);
  }

  public async updateUserCoin(
    updateUserCoinDto: UpdateCoinToUserDto,
  ): Promise<CoinToUserDto> {
    const { amount, invested } = updateUserCoinDto;

    const userCoin = await this.coinToUserRepository.findOne({
      where: { id: updateUserCoinDto.id },
    });

    userCoin.amount = amount;
    userCoin.invested = invested;
    return await this.coinToUserRepository.save(userCoin);
  }

  public async findAllUserCoins(
    userId: number,
  ): Promise<UserCoinWithQuotesDto[]> {
    try {
      const userCoins = await this.coinToUserRepository.find({
        where: { userId },
        relations: ['transactions', 'coin'],
      });
      const userCoinsWithQuotes = await this.fillUserCoinsWithQuotes(userCoins);
      return userCoinsWithQuotes;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during finding all coins',
        error,
      });
    }
  }

  public async findCoinByName(name: string): Promise<CoinDto> {
    try {
      return await this.coinsRepository.findOne({ where: { name } });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during finding coin by name',
        error,
      });
    }
  }

  public async findUserCoinByName(
    name: string,
    userId: number,
    { withTransactions = false }: { withTransactions?: boolean } = {},
  ): Promise<CoinToUserDto> {
    try {
      const queryBuilder = this.coinToUserRepository
        .createQueryBuilder('coinToUser')
        .leftJoinAndSelect('coinToUser.coin', 'coin')
        .where('coin.name = :name', { name })
        .andWhere('coinToUser.userId = :userId', { userId });

      if (withTransactions) {
        queryBuilder.leftJoinAndSelect(
          'coinToUser.transactions',
          'transactions',
        );
      }
      return queryBuilder.getOne();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during finding coin by name',
        error,
      });
    }
  }

  // public async findOneByNameWithTransactions(name: string): Promise<CoinDto> {
  //   try {
  //     const coin = await this.coinsRepository
  //       .createQueryBuilder('coin')
  //       .leftJoinAndSelect('coin.transactions', 'transactions')
  //       .where('coin.name = :name', { name })
  //       .getOne();
  //     return coin;
  //   } catch (error) {
  //     throw new InternalServerErrorException({
  //       message: 'There was an error during finding coin by name',
  //       error,
  //     });
  //   }
  // }

  private async fillUserCoinsWithQuotes(
    userCoins: CoinToUserDto[],
  ): Promise<UserCoinWithQuotesDto[]> {
    const coinsWithQuotes = await this.fillCoinDataWithQuotes(
      userCoins.map((userCoin) => userCoin.coin),
    );

    return userCoins.map((userCoin) => {
      const coin = coinsWithQuotes.find((c) => c.name === userCoin.coin.name);
      const { amount, invested } = userCoin;
      const totalValue = amount * coin.price;
      const pnl = ((totalValue - invested) / Math.abs(invested)) * 100;
      const avg = invested && amount ? invested / amount : 0;

      return {
        ...userCoin,
        coin: { ...userCoin.coin, ...coin },
        pnl,
        avg,
        totalValue,
      };
    });
  }

  private async fillCoinDataWithQuotes(coins: CoinDto[]): Promise<CoinDto[]> {
    const coinQuotes = await this.quotesProcessor.getSelectedQuotes(coins);
    return coinQuotes;
  }

  // private async updateCoinsWithActualQuotes(
  //   coins: CoinDto[],
  // ): Promise<CoinDto[]> {
  //   const coinQuotes = await this.quotesProcessor.getSelectedQuotes(coins);
  //   return coins.map((coin) => ({
  //     ...coinQuotes.find((c) => c.name === coin.name),
  //     ...coin,
  //   }));
  // }
}
