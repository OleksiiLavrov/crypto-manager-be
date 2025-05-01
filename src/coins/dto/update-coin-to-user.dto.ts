import { OmitType } from '@nestjs/swagger';
import { CoinToUserDto } from './coin-to-user.dto';

export class UpdateCoinToUserDto extends OmitType(CoinToUserDto, [
  'createdAt',
  'updatedAt',
  'coin',
  'user',
]) {}
