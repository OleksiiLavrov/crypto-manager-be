import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ClientSession, Model } from 'mongoose';

import { AddCoinDto } from './dto/add-coin.dto';

import { Coin, CoinDocument } from './coins.schema';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name)
    private readonly coinsModel: Model<Coin>,
  ) {}

  private async create(
    createCoinDto: AddCoinDto,
    session: ClientSession,
  ): Promise<Coin> {
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

  private async update(
    createCoinDto: AddCoinDto,
    coin: CoinDocument,
    session: ClientSession,
  ): Promise<Coin> {
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
  ): Promise<Coin> {
    const coin = await this.coinsModel
      .findOne({ name: addCoinDto.name })
      .session(session);

    if (coin) {
      return await this.update(addCoinDto, coin, session);
    } else {
      return await this.create(addCoinDto, session);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}