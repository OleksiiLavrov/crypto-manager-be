import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';
import { CoinDto } from './coin.dto';

export class CoinToUserDto {
  @ApiProperty({ example: 1, description: 'Coin to user id' })
  public id: number;

  @ApiProperty({ example: 1, description: 'Coin id' })
  public coinId: number;

  @ApiProperty({ example: 1, description: 'User id' })
  public userId: number;

  @ApiProperty({ example: 1000, description: 'Coin amount' })
  public amount: number;

  @ApiProperty({ example: 1000000, description: 'Coin invested' })
  public invested: number;

  @ApiProperty({ example: '2024-01-01', description: 'Date of last update' })
  public updatedAt: Date;

  @ApiProperty({ example: '2024-01-01', description: 'Date of creation' })
  public createdAt: Date;

  @ApiProperty({ example: 1, description: 'Coin' })
  public coin?: CoinDto;

  @ApiProperty({ example: 1, description: 'User' })
  public user?: UserDto;
}

export class UserCoinWithQuotesDto extends CoinToUserDto {
  public totalValue: number;
  public avg: number;
  public pnl: number;
}
