import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'typeorm';
import { Public } from '../decorators/public.decorator';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly connection: Connection,
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return await this.healthCheckService.check([
      async () =>
        this.typeOrmHealthIndicator.pingCheck('database', {
          timeout: 5_000,
          connection: this.connection,
        }),
    ]);
  }

  @Public()
  @Get('/wait/:ms')
  public async wait(@Param('ms', ParseIntPipe) ms: number): Promise<number> {
    return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
  }
}
