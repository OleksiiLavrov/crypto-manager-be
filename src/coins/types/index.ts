import { CoinDocument } from '../coins.schema';

type ComputedCoinData = {
  total_value: number;
  avg: number;
  pnl: number;
};

export type CoinQuote = {
  price: number;
  market_cap: number;
};

export type CoinModel = CoinDocument | CoinQuote | ComputedCoinData;
