import { PartialType } from '@nestjs/swagger';
import { CreateBinanceDto } from './create-binance.dto';

export class UpdateBinanceDto extends PartialType(CreateBinanceDto) {}
