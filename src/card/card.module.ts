import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardMember } from './entities/card-member.entity';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import { SseModule } from 'src/sse/sse.module';
@Module({
  imports: [TypeOrmModule.forFeature([Card, CardMember, List, User]), SseModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
