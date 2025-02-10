import { ApiProperty } from '@nestjs/swagger';


export class CoinDto {
  @ApiProperty({ example: 1, description: 'Coin id' })
  public id: number;

  @ApiProperty({ example: 'BTC', description: 'Coin name' })
  public name: string;

  @ApiProperty({ example: 1000, description: 'Coin price', required: false })
  public price?: number;

  @ApiProperty({
    example: 1000000,
    description: 'Coin market cap',
    required: false,
  })
  public marketCap?: number;

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