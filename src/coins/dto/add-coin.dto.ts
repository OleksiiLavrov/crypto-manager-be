import { ApiProperty } from '@nestjs/swagger';

export class AddCoinDto {
  @ApiProperty({ example: 'BTC', description: 'Coin name' })
  readonly name: string;

  @ApiProperty({ example: 10, description: 'Amount of these coins' })
  readonly add_amount: number;

  @ApiProperty({
    example: 500,
    description: 'Total amount of money spended on buying this coin',
  })
  readonly add_invested: number;
}
