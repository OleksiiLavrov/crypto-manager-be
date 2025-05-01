import { ApiProperty } from '@nestjs/swagger';
import { CoinDto } from 'src/coins/dto/coin.dto';

export class TransactionDto {
  @ApiProperty({
    example: 1,
    description: 'Transaction id',
  })
  public id: number;

  @ApiProperty({
    example: 1,
    description: 'Coin id',
  })
  public coinId: number;

  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  public userId: number;

  @ApiProperty({
    example: 100,
    description: 'Amount of coins',
  })
  public amount: number;

  @ApiProperty({
    example: 1000,
    description: 'Total amount of money spended on buying this coin',
  })
  public cost: number;

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

  @ApiProperty({
    type: CoinDto,
    description: 'Coin',
  })
  public coin?: CoinDto;
}
