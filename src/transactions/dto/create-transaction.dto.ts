import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: 100,
    description: 'Amount of coins',
  })
  readonly coin_amount: number;

  @ApiProperty({
    example: 1000,
    description: 'Total amount of money spended on buying this coin',
  })
  readonly total_cost: number;
}
