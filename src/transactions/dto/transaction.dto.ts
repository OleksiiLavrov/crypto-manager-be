import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({
    example: 1,
    description: 'Transaction id',
  })
  public id: number;

  @ApiProperty({
    example: 'BTC',
    description: 'Coin name',
  })
  public coinName: string;

  @ApiProperty({
    example: 1,
    description: 'Coin id',
  })
  public coinId: number;

  @ApiProperty({
    example: 100,
    description: 'Amount of coins',
  })
  public coinAmount: number;

  @ApiProperty({
    example: 1000,
    description: 'Total amount of money spended on buying this coin',
  })
  public totalCost: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Date of last update',
  })
  public updatedAt: Date;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Date of creation',
  })
  public createdAt: Date;
}
