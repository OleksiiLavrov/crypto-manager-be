import { OmitType } from '@nestjs/swagger';
import { CoinDto } from './coin.dto';

export class CreateCoinDto extends OmitType(CoinDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}