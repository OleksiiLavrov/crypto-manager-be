import { CoinDocument } from '../coins.schema';

export type CoinQuote = {
  price: number;
  market_cap: number;
};

export type CoinModel = {
  coin: CoinDocument;
  quote: CoinQuote;
};
