import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('1. health-check')
@Controller()
export class AppController {
  @Get('health-check')
  healthCheck(): string {
    return 'This sever is healthy';
  }
}
