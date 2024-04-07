import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ClientSession, Model } from 'mongoose';

import { marketData } from 'src/helpers/marketData';

import { AddCoinDto } from './dto/add-coin.dto';

import { Coin, CoinDocument } from './coins.schema';
import { CoinModel } from './types';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name)
    private readonly coinsModel: Model<Coin>,
  ) {}

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
    const coinsQuotes = await marketData.getSelectedQuotes(
      coins.map((coin) => coin.name),
    );
    return coins.map((coin, index) => ({ coin, quote: coinsQuotes[index] }));
  }

  public async findOneByName(name: string): Promise<CoinModel> {
    const coin = await this.coinsModel.findOne({ name });
    const coinsQuotes = await marketData.getSelectedQuotes([name]);
    return { coin, quote: coinsQuotes[0] };
  }
}
