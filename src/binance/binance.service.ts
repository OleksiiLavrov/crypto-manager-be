import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wallet } from '@binance/wallet';
import { ConfigEnum } from '../constants';

@Injectable()
export class BinanceService {
  private readonly client: Wallet;

  constructor(private readonly configService: ConfigService) {
    const configurationRestAPI = {
      apiKey: this.configService.get<string>(ConfigEnum.BINANCE_API_KEY),
      apiSecret: this.configService.get<string>(ConfigEnum.BINANCE_API_SECRET),
    };
    this.client = new Wallet({ configurationRestAPI });
  }

  public async getAccountInfo(): Promise<any> {
    return await this.client.restAPI.userAsset();
  }

  findAll() {
    return `This action returns all binance`;
  }
}
