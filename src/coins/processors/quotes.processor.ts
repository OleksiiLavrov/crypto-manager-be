import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { catchError, lastValueFrom, map } from 'rxjs';

import { Coin } from '../coins.schema';
import { CoinQuote } from '../types';

@Injectable()
export class QuotesProcessor {
  constructor(private readonly httpService: HttpService) {}

  public async getSelectedQuotes(coins: Coin[]): Promise<CoinQuote[]> {
    const coinSlugs = coins.map((c) => c.name);
    try {
      const coinsQuotes = await lastValueFrom(
        this.httpService
          .get(
            `${process.env.MARKET_QUOTES_URI}/v1/cryptocurrency/quotes/latest?symbol=${coinSlugs.join()}`,
            {
              headers: {
                'X-CMC_PRO_API_KEY': process.env.MARKET_QUOTES_API_KEY,
              },
            },
          )
          .pipe(
            map((response) => response.data.data),
            catchError((error) => {
              throw new InternalServerErrorException(
                'Error fetching quotes from API',
                error.message,
              );
            }),
          ),
      );

      return coinSlugs.map((coinSlug): CoinQuote => {
        if (coinsQuotes[coinSlug] && coinsQuotes[coinSlug].quote.USD) {
          const { market_cap, price } = coinsQuotes[coinSlug].quote.USD;
          return { market_cap, price };
        } else {
          return { market_cap: 0, price: 0 };
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
