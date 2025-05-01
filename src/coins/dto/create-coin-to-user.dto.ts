import { OmitType } from '@nestjs/swagger';
import { CoinToUserDto } from './coin-to-user.dto';

export class CreateCoinToUserDto extends OmitType(CoinToUserDto, [
  'coin',
  'user',
  'id',
  'createdAt',
  'updatedAt',
]) {}
