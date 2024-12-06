import { ApiProperty } from '@nestjs/swagger';

import { TransactionDto } from 'src/transactions/dto/transaction.dto';

export class CoinDto {
  @ApiProperty({ example: 1, description: 'Coin id' })
  public id: number;

  @ApiProperty({ example: 'BTC', description: 'Coin name' })
  public name: string;

  @ApiProperty({ example: 10, description: 'Amount of these coins' })
  public totalAmount: number;

  @ApiProperty({
    example: 500,
    description: 'Total amount of money spended on buying this coin',
  })
  public totalInvested: number;

  @ApiProperty({
    type: [TransactionDto],
    description: 'List of transactions for this coin',
  })
  public transactions: TransactionDto[];
}

export class ComputedCoinDto extends CoinDto {
  public totalValue: number;
  public avg: number;
  public pnl: number;
}

export class CoinQuoteDto {
  public price: number;
  public marketCap: number;
}
