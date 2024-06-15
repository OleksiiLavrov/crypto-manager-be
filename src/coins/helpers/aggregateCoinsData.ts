import { CoinDocument } from '../coins.schema';
import quoteProcessor from '../processors/quotes.processor';
import { CoinModel } from '../types';

export const aggregateCoinsData = async (
  coins: CoinDocument[],
): Promise<CoinModel[]> => {
  const coinQuotes = await quoteProcessor.getSelectedQuotes(coins);
  return coins.map((coin, index): CoinModel => {
    const { total_amount, total_invested } = coin;
    const pnl =
      (total_amount * coinQuotes[index].price * 100) / total_invested - 100;
    const totalValue = total_amount * coinQuotes[index].price;
    const avg = total_invested / total_amount;
    // TODO: fix this by using sql db and normal types
    return {
      ...coin['_doc'],
      ...coinQuotes[index],
      total_value: totalValue,
      pnl,
      avg,
    };
  });
};
