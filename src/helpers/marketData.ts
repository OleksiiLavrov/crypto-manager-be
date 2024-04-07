import { InternalServerErrorException } from '@nestjs/common';

import axios from 'axios';

import { CoinQuote } from 'src/coins/types';

const axiosInstance = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com',
});

class MarketData {
  public async getSelectedQuotes(coinSlugs: string[]): Promise<CoinQuote[]> {
    try {
      const { data: coinsQuotes } = await axiosInstance.get(
        `/v1/cryptocurrency/quotes/latest?symbol=${coinSlugs.join()}`,
        { headers: { 'X-CMC_PRO_API_KEY': process.env.MARKET_QUOTES_API } },
      );

      return coinSlugs.map((coinSlug): CoinQuote => {
        if (
          coinsQuotes.data[coinSlug] &&
          coinsQuotes.data[coinSlug].quote.USD
        ) {
          const { market_cap, price } = coinsQuotes.data[coinSlug].quote.USD;
          return { market_cap, price };
        } else {
          throw new Error();
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

export const marketData = new MarketData();
