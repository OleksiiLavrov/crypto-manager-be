import { read, utils } from 'xlsx';

import { TransactionDto } from 'src/transactions/dto/transaction.dto';

type TransactionData = {
  coin_amount: number;
  total_cost: number;
  transactions: TransactionDto[];
};

type TransactionsPerCoin = {
  [coin_name: string]: TransactionData;
};

class ExcelParser {
  private aggregateTransactions(transactions: TransactionDto[]) {
    return transactions.reduce((acc, transaction) => {
      if (acc[transaction.coin_name]) {
        acc[transaction.coin_name].transactions.push(transaction);
        acc[transaction.coin_name].coin_amount += transaction.coin_amount;
        acc[transaction.coin_name].total_cost += transaction.total_cost;
      } else {
        acc[transaction.coin_name] = {
          transactions: [transaction],
          coin_amount: transaction.coin_amount,
          total_cost: transaction.total_cost,
        };
      }
      return acc;
    }, {} as TransactionsPerCoin);
  }

  public parseExcelFile(file: any): TransactionsPerCoin {
    const workbook = read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(sheet) as TransactionDto[];
    return this.aggregateTransactions(data);
  }
}

export const excelParser = new ExcelParser();
