import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardMember } from './entities/card-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardMember])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
