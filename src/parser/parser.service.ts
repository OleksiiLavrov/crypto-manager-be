import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Readable } from 'stream';
import { read, utils, write } from 'xlsx';

import { FileCreatedEvent } from 'src/files/events/file-created.event';
import { TransactionDto } from 'src/transactions/dto/transaction.dto';

type TransactionData = {
  coin_amount: number;
  total_cost: number;
  transactions: TransactionDto[];
};

type TransactionsPerCoin = {
  [coin_name: string]: TransactionData;
};

@Injectable()
export class ParserService {
  constructor(private eventEmitter: EventEmitter2) {}

  private readXlsxFile(file: Express.Multer.File) {
    const workbook = read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return utils.sheet_to_json(sheet);
  }

  private writeXlsxFile(data: any[], fileName: string) {
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, 'sheet1');
    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: fileName,
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: fileBuffer.length,
      buffer: fileBuffer,
      destination: '',
      filename: '',
      path: '',
      stream: Readable.from(fileBuffer),
    };

    this.eventEmitter.emit('file.created', new FileCreatedEvent(file));
  }

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

  // not used for now
  public parseXlsxTransactionsData(
    file: Express.Multer.File,
  ): TransactionsPerCoin {
    const data = this.readXlsxFile(file) as TransactionDto[];
    return this.aggregateTransactions(data);
  }

  public parseXlsxTable(file: Express.Multer.File) {
    const data = this.readXlsxFile(file);
    const slicedData = data.slice(1, data.length - 7);

    const transactionsPerCoin = slicedData.map((row) => {
      const result = [];
      const keys = Object.keys(row);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].includes('месяц')) {
          const coinAmountKey = keys[i + 1];
          const totalCostKey = keys[i + 2];
          if (row[coinAmountKey] !== 0 && row[totalCostKey] !== 0) {
            result.push({
              coin_name: row['__EMPTY'],
              coin_amount: row[coinAmountKey],
              total_cost: row[totalCostKey],
            });
          }
          i += 2;
        }
      }

      return result;
    });

    this.writeXlsxFile(transactionsPerCoin.flat(1), 'transactions_report');

    return this.aggregateTransactions(transactionsPerCoin.flat(1));
  }
}
