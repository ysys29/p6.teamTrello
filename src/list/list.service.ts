import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { LexoRank } from 'lexorank';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}

  // 리스트 생성
  async createList(userId: number, boardId: number, title: string) {
    // 해당 아이디의 보드가 있는지 확인
    const board = await this.boardRepository.findOneBy({ id: boardId });

    if (!board) {
      throw new NotFoundException('해당하는 아이디의 보드가 없습니다.');
    }

    // 해당 보드에 접근(생성) 권한이 있는지 확인
    const availableMember = await this.boardMemberRepository.findOne({
      where: { boardId, userId },
    });

    if (!availableMember) {
      throw new UnauthorizedException('해당 보드에 권한이 없습니다.');
    }

    // 해당 보드의 가장 마지막에 위치한 리스트 찾기
    const lastList = await this.listRepository.findOne({
      where: { boardId },
      order: { lexoRank: 'DESC' },
    });

    // lexoRank 생성
    let lexoRank: LexoRank;
    // 보드에 리스트가 없다면 중간값으로 설정
    if (!lastList) {
      lexoRank = LexoRank.middle();
    } else {
      // 있다면 마지막에 위치한 리스트의 lexoRank보다 큰 값 생성
      const lastListLexoRank = LexoRank.parse(lastList.lexoRank);

      lexoRank = lastListLexoRank.genNext();
    }

    // 해당 리스트 저장
    await this.listRepository.save({
      boardId,
      title,
      lexoRank: lexoRank.toString(),
    });

    return true;
  }
}
