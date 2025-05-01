import { Controller, Get, Param, Req } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';
import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Roles(UserRole.USER)
  @Get()
  findAll(@Req() req) {
    const user = req.user;
    return this.coinsService.findAllUserCoins(user.id);
  }

  @Get('/:name')
  findOneByName(@Param('name') name: string, @Req() req) {
    const user = req.user;
    return this.coinsService.findUserCoinByName(name, user.id);
  }

  @Get('/:name/transactions')
  findOneByNameWithTransactions(@Param('name') name: string, @Req() req) {
    const user = req.user;
    return this.coinsService.findUserCoinByName(name, user.id, {
      withTransactions: true,
    });
  }
}
