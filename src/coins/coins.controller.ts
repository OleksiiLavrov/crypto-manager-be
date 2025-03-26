import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.coinsService.findAllUserCoins(+userId);
  }

  @Get(':name/:userId')
  findOneByName(@Param('name') name: string, @Param('userId') userId: string) {
    return this.coinsService.findUserCoinByName(name, +userId);
  }

  @Get('/:name/transactions/:userId')
  findOneByNameWithTransactions(
    @Param('name') name: string,
    @Param('userId') userId: string,
  ) {
    return this.coinsService.findUserCoinByName(name, +userId, {
      withTransactions: true,
    });
  }
}
