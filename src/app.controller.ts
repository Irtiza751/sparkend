import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from './interfaces/health.interface';
import { Public } from './decorators/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHealth(): HealthCheck {
    return this.appService.getHealth();
  }
}
