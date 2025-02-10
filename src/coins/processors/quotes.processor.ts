import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CoinDto } from '../dto/coin.dto';

@Injectable()
export class QuotesProcessor {
  constructor(private readonly httpService: HttpService) {}

  public async getSelectedQuotes(coins: CoinDto[]): Promise<CoinDto[]> {
    const coinSlugs = coins.map((c) => c.name);
    const coinsQuotes = await this.getCoinQuotesBySlugs(coinSlugs);
    return coinSlugs.map((coinSlug): CoinDto => {
      const coin = coins.find((c) => c.name === coinSlug);
      if (coinsQuotes[coinSlug] && coinsQuotes[coinSlug].quote.USD) {
        const { market_cap, price } = coinsQuotes[coinSlug].quote.USD;
        return { ...coin, marketCap: market_cap, price };
      } else {
        return { ...coin, marketCap: 0, price: 0 };
      }
    });
  }

  private async getCoinQuotesBySlugs(coinSlugs: string[]) {
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
      return coinsQuotes;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'There was an error during getting market quotes',
        error,
      });
    }
  }
}