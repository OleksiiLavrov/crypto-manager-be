import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoinDto {
  @ApiProperty({ example: 10, description: 'Amount of these coins' })
  public addAmount: number;

  @ApiProperty({
    example: 500,
    description: 'Total amount of money spended on buying this coin',
  })
  public addInvested: number;
}
