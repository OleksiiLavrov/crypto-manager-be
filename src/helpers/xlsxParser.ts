import { read, utils } from 'xlsx';

import { TransactionDto } from 'src/transactions/dto/transaction.dto';

export const parseExcelFile = (file: any): TransactionDto[] => {
  const workbook = read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = utils.sheet_to_json(sheet) as TransactionDto[];
  return data;
};