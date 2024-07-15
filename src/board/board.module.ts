import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { List } from '../list/entities/list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardMember, List]), // List 엔티티 추가
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
