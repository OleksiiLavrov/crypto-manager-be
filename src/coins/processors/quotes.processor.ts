import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CoinDto } from '../dto/coin.dto';
import { ConfigEnum } from '../../constants';

@Injectable()
export class QuotesProcessor {
  private readonly marketQuotesApiKey: string;
  private readonly marketQuotesUri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.marketQuotesApiKey = this.configService.get<string>(
      ConfigEnum.MARKET_QUOTES_API_KEY,
    );
    this.marketQuotesUri = this.configService.get<string>(
      ConfigEnum.MARKET_QUOTES_URI,
    );
  }

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
            `${this.marketQuotesUri}/v1/cryptocurrency/quotes/latest?symbol=${coinSlugs.join()}`,
            {
              headers: {
                'X-CMC_PRO_API_KEY': this.marketQuotesApiKey,
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
