import { OmitType } from '@nestjs/swagger';
import { CoinDto } from './coin.dto';

export class UpdateCoinDto extends OmitType(CoinDto, [
  'createdAt',
  'updatedAt',
]) {}
