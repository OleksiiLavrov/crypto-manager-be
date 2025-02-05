import { Controller, Get, Param } from '@nestjs/common';

import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get()
  findAll() {
    return this.coinsService.findAll();
  }

  @Get(':name')
  findOneByName(@Param('name') name: string) {
    return this.coinsService.findOneByName(name);
  }

  @Get('/:name/transactions')
  findOneByNameWithTransactions(@Param('name') name: string) {
    return this.coinsService.findOneByNameWithTransactions(name);
  }
}
