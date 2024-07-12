import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { BoardInvitation } from './entities/board-invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember, BoardInvitation])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
