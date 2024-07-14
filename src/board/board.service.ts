import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}

  // 보드 생성
  async create(createBoardDto: CreateBoardDto, userId: number): Promise<Board> {
    // DTO를 사용하여 새 보드 객체 생성
    const board = this.boardRepository.create({ ...createBoardDto, ownerId: userId });
    // 생성된 보드 객체를 데이터베이스에 저장
    const savedBoard = await this.boardRepository.save(board);
    // 보드 생성자를 보드 멤버로 추가
    const boardMember = this.boardMemberRepository.create({
      boardId: savedBoard.id,
      userId: userId,
    });
    await this.boardMemberRepository.save(boardMember);

    return savedBoard;
  }

  // 보드 상세 조회
  async findOne(id: number, userId: number): Promise<any> {
    // 반환 타입을 any로 변경
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['boardMembers', 'lists'],
      select: ['id', 'title', 'description', 'color', 'createdAt', 'updatedAt'],
    });

    if (!board) {
      throw new NotFoundException(`존재하지 않는 보드입니다.`);
    }

    const isMember = await this.boardMemberRepository.findOne({
      where: { boardId: id, userId },
    });

    if (!isMember) {
      throw new UnauthorizedException('해당 보드에 접근할 권한이 없습니다.');
    }

    const response = {
      id: board.id,
      title: board.title,
      description: board.description,
      color: board.color,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      boardMembers: board.boardMembers.map((member) => ({
        id: member.id,
        userId: member.userId,
      })),
      lists: board.lists,
    };

    return response;
  }

  // 보드 수정
  async update(id: number, updateBoardDto: UpdateBoardDto, userId: number): Promise<Board> {
    // 주어진 ID로 보드 객체를 조회
    const board = await this.boardRepository.findOne({ where: { id } });

    // 보드가 존재하지 않으면 에러
    if (!board) {
      throw new NotFoundException(`존재하지 않는 보드입니다.`);
    }

    // 보드의 소유자가 아닌 경우 예외 발생
    if (board.ownerId !== userId) {
      throw new UnauthorizedException('보드를 수정할 권한이 없습니다.');
    }

    // 보드 객체 업데이트
    Object.assign(board, updateBoardDto);

    // 업데이트된 보드 객체를 데이터베이스에 저장
    return this.boardRepository.save(board);
  }

  // 보드 소프트 삭제
  async softDelete(id: number, userId: number): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`존재하지 않는 보드입니다.`);
    }

    // 보드의 소유자가 아닌 경우 예외 발생
    if (board.ownerId !== userId) {
      throw new UnauthorizedException('보드를 삭제할 권한이 없습니다.');
    }

    await this.boardRepository.softRemove(board);
  }

  // 보드 멤버 조회
  async getBoardMembers(boardId: number, userId: number) {
    // 사용자가 보드 멤버인지 확인
    const board = await this.boardRepository.find({
      where: { id: boardId, deletedAt: null },
    });

    if (!board) {
      throw new NotFoundException('삭제된 보드 입니다 ');
    }
    const isMember = await this.boardMemberRepository.findOne({
      relations: { board: true },
      where: {
        boardId,
        userId,
        board: {
          deletedAt: null, //삭제가 된거는 안가져올래요
        },
      },
    });

    if (!isMember) {
      throw new UnauthorizedException('해당 보드에 접근할 권한이 없습니다.');
    }

    const data = await this.boardMemberRepository.find({
      relations: { board: true },
      where: {
        boardId: boardId,
        board: {
          deletedAt: null,
          id: boardId,
        },
      },
    });
    if (data.length === 0) {
      throw new NotFoundException('삭제된 보드입니다');
    }
  }

  // 사용자가 속한 보드 조회
  async getUserBoards(userId: number): Promise<Board[]> {
    const boardMembers = await this.boardMemberRepository.find({
      where: { userId },
      relations: ['board'],
    });

    // board가 null이 아니고 deletedAt이 null인 경우만 필터링
    const boards = boardMembers
      .map((member) => member.board)
      .filter((board) => board !== null && board.deletedAt === null);

    return boards;
  }

  // 제목별로 보드 검색
  async searchBoardsByTitle(userId: number, title: string): Promise<Board[]> {
    const boardMembers = await this.boardMemberRepository.find({
      where: { userId },
      relations: ['board'],
    });

    // board가 null이 아닌 경우만 필터링
    const boardIds = boardMembers.filter((member) => member.board !== null).map((member) => member.board.id);

    return this.boardRepository.find({
      where: {
        id: In(boardIds),
        title: Like(`%${title}%`),
      },
    });
  }
}
