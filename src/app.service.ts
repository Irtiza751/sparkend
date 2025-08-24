import { Injectable } from '@nestjs/common';
import { HealthCheck } from '@core/interfaces/health.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): HealthCheck {
    return {
      message: 'NestJS API Boilerplate is running!',
      timestamp: new Date().toISOString(),
    };
  }
}
