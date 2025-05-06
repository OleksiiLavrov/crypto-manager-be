import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { CoinToUser } from './entity/coin-to-user.entity';
import { Coin } from './entity/coin.entity';
import { QuotesProcessor } from './processors/quotes.processor';

describe('CoinsController', () => {
  let controller: CoinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [CoinsController],
      providers: [
        CoinsService,
        QuotesProcessor,
        { provide: getRepositoryToken(Coin), useValue: {} },
        { provide: getRepositoryToken(CoinToUser), useValue: {} },
      ],
    }).compile();

    controller = module.get<CoinsController>(CoinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
