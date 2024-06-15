import { InternalServerErrorException } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';

import { Coin } from '../coins.schema';
import { CoinQuote } from '../types';

class QuotesProcessor {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://pro-api.coinmarketcap.com',
      headers: { 'X-CMC_PRO_API_KEY': 'b9eba22b-eb9b-472e-abdf-93d80686a497' },
    });
  }

  public async getSelectedQuotes(coins: Coin[]): Promise<CoinQuote[]> {
    const coinSlugs = coins.map((c) => c.name);
    try {
      const { data: coinsQuotes } = await this.axiosInstance.get(
        `/v1/cryptocurrency/quotes/latest?symbol=${coinSlugs.join()}`,
      );

      return coinSlugs.map((coinSlug): CoinQuote => {
        if (
          coinsQuotes.data[coinSlug] &&
          coinsQuotes.data[coinSlug].quote.USD
        ) {
          const { market_cap, price } = coinsQuotes.data[coinSlug].quote.USD;
          return { market_cap, price };
        } else {
          throw new Error(`No USD quote for ${coinSlug}`);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during getting market quotes',
        error,
      });
    }
  }
}

export default new QuotesProcessor();
