import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';

@Module({
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService], // 다른 모듈에서 SseService를 사용할 수 있도록 export
})
export class SseModule {}
