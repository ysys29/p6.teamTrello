import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { DataSource, Repository } from 'typeorm';
import { LexoRank } from 'lexorank';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { ReorderListDto } from './dtos/reorder-list.dto';
import { ValidateListAccess } from './types/validate-list-access.type';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';

@Injectable()
export class ListService {
  createList(id: any, createListDto: CreateListDto) {
    throw new Error('Method not implemented.');
  }
  // dataSource: any;
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    private readonly dataSource: DataSource,
  ) {}

  // 리스트 생성 async createList
  private async createListQueryRunner(userId: number, createListDto: CreateListDto) {
    const { boardId, title } = createListDto;

    // 해당 아이디의 보드가 있는지 확인
    const board = await this.boardRepository.findOneBy({ id: boardId });

    if (!board) {
      throw new NotFoundException('해당하는 아이디의 보드가 없습니다.');
    }

    // 해당 보드에 접근(생성) 권한이 있는지 확인
    const isAvailableMember = await this.boardMemberRepository.findOne({
      where: { boardId, userId },
    });

    if (!isAvailableMember) {
      throw new UnauthorizedException('해당 리스트에 권한이 없습니다.');
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
    const newList = await this.listRepository.save({
      boardId,
      title,
      lexoRank: lexoRank.toString(),
    });

    return {
      id: newList.id,
      title: newList.title,
    };
  }

  // 리스트 상세 조회
  async getList(userId: number, listId: number) {
    // 리스트 접근 권한 체크
    const list = await this.validateListAccess({ userId, listId, relation: true });

    //카드를 lexoRank를 기준으로 정렬(asc로)
    list.cards.sort((a, b) => a.lexoRank.localeCompare(b.lexoRank)); //localCompare: 문자열과 문자열을 비교

    return {
      id: list.id,
      title: list.title,
      cards: list.cards.map((card) => ({
        cardId: card.id,
        title: card.title,
        deadline: card.deadline,
      })),
    };
  }

  // 리스트 이름 수정
  async updateListTitle(userId: number, listId: number, { title }: UpdateListDto) {
    // 리스트 접근 권한 체크
    const list = await this.validateListAccess({ userId, listId });

    // 리스트 이름 수정해서 저장
    const updatedList = await this.listRepository.save({
      ...list,
      title: title,
    });

    return updatedList.title;
  }

  // 리스트 순서 변경
  async reorderList(userId: number, listId: number, reorderListDto: ReorderListDto) {
    const { beforeId, afterId } = reorderListDto;

    if (!beforeId && !afterId) {
      throw new BadRequestException('beforeId와 afterId 둘 중 하나는 입력해 주세요.');
    }

    // 리스트 접근 권한 체크
    const list = await this.validateListAccess({ userId, listId });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 이동 후 이전과 이후에 위치할 리스트 찾기

      // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 2번 리스트
      const beforeList = beforeId
        ? await queryRunner.manager.findOne(List, {
            where: { id: beforeId },
            lock: { mode: 'pessimistic_write' },
          })
        : null;

      // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 3번 리스트
      const afterList = afterId
        ? await queryRunner.manager.findOne(List, {
            where: { id: afterId },
            lock: { mode: 'pessimistic_write' },
          })
        : null;

      // beforeId가 있고, beforeList가 없는 경우
      if ((beforeId && !beforeList) || (afterId && !afterList)) {
        throw new BadRequestException('리스트가 변경되었으니 다시 호출해 주세요.');
      }

      // 이전과 이후 리스트의 lexoRank
      const beforeListLexoRank = beforeList ? LexoRank.parse(beforeList.lexoRank) : null;
      const afterListLexoRank = afterList ? LexoRank.parse(afterList.lexoRank) : null;

      // 이동할 아이템에 새로 할당할 lexoRank 정의
      let lexoRank: LexoRank;

      // 첫번째로 이동시켰을 때
      if (!beforeList) {
        lexoRank = afterListLexoRank.genPrev();
      } else if (!afterListLexoRank) {
        // 마지막으로 이동시켰을 때
        lexoRank = beforeListLexoRank.genNext();
      } else {
        // 리스트와 리스트 사이로 이동시켰을 때
        lexoRank = beforeListLexoRank.between(afterListLexoRank);
      }

      const updatedList = this.listRepository.create({ ...list, lexoRank: lexoRank.toString() });

      await queryRunner.manager.save(List, updatedList);

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

  }

  // 리스트 삭제
  async deleteList(userId: number, listId: number) {
    // 리스트 접근 권한 체크
    const list = await this.validateListAccess({ userId, listId });

    await this.listRepository.softDelete({ id: listId });

    return true;
  }

  // 리스트 접근 권한 체크
  async validateListAccess(validateListAccess: ValidateListAccess) {
    const { userId, listId, relation } = validateListAccess;

    const relationCondition = relation ? ['cards', 'board'] : ['board'];

    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: relationCondition,
    });

    if (!list) {
      throw new NotFoundException('해당 아이디에 해당하는 리스트가 없습니다.');
    }

    const isAvailableMember = await this.boardMemberRepository.findOne({
      where: {
        boardId: list.board.id,
        userId,
      },
    });

    if (!isAvailableMember) {
      throw new UnauthorizedException('해당 리스트에 접근 권한이 없습니다.');
    }

    return list;
  }
}
