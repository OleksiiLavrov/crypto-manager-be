import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ClientSession, Model } from 'mongoose';

import { AddCoinDto } from './dto/add-coin.dto';

import { Coin, CoinDocument } from './coins.schema';
import { QuotesProcessor } from './processors/quotes.processor';
import { CoinModel } from './types';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name)
    private readonly coinsModel: Model<Coin>,
    private readonly quotesProcessor: QuotesProcessor,
  ) {}

  private async aggregateCoinsData(
    coins: CoinDocument[],
  ): Promise<CoinModel[]> {
    const coinQuotes = await this.quotesProcessor.getSelectedQuotes(coins);
    return coins.map((coin, index): CoinModel => {
      const { total_amount, total_invested } = coin;
      const totalValue = total_amount * coinQuotes[index].price;
      const pnl =
        ((totalValue - total_invested) / Math.abs(total_invested)) * 100;
      const avg = total_invested / total_amount;
      // TODO: fix this by using sql db and normal types
      return {
        ...coin['_doc'],
        ...coinQuotes[index],
        total_value: totalValue,
        pnl,
        avg,
      };
    });
  }

  private async createCoin(
    createCoinDto: AddCoinDto,
    session: ClientSession,
  ): Promise<CoinDocument> {
    const { name, add_amount, add_invested } = createCoinDto;
    try {
      const coin = new this.coinsModel({
        total_invested: add_invested,
        total_amount: add_amount,
        name: name,
      });

      return await coin.save({ session });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during creating the coin',
        error,
      });
    }
  }

  private async updateCoin(
    createCoinDto: AddCoinDto,
    coin: CoinDocument,
    session: ClientSession,
  ): Promise<CoinDocument> {
    const { add_amount, add_invested } = createCoinDto;
    try {
      coin.total_amount += add_amount;
      coin.total_invested += add_invested;
      return await coin.save({ session });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during updating the coin',
        error,
      });
    }
  }

  public async add(
    addCoinDto: AddCoinDto,
    session: ClientSession,
  ): Promise<CoinDocument> {
    const coin = await this.coinsModel
      .findOne({ name: addCoinDto.name })
      .session(session);

    if (coin) {
      return await this.updateCoin(addCoinDto, coin, session);
    } else {
      return await this.createCoin(addCoinDto, session);
    }
  }

  public async findAll(): Promise<CoinModel[]> {
    const coins = await this.coinsModel.find();
    return await this.aggregateCoinsData(coins);
  }

  public async findOneByName(name: string): Promise<CoinModel> {
    const coin = await this.coinsModel.findOne({ name });
    return await this.aggregateCoinsData([coin])[0];
  }
}
