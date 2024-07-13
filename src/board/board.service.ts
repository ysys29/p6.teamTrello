import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Repository } from 'typeorm';
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
    return this.boardRepository.save(board);
  }

  // 보드 목록 검색 추가 구현 사항, 일단은
  findAll() {
    return `This action returns all board`;
  }

  // 보드 상세 조회
  async findOne(id: number, userId: number): Promise<Board> {
    // 주어진 ID로 보드 객체를 조회
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['user', 'boardMembers', 'lists'],
      // 보드 멤버들과 리스트들도 받아옴
    });

    // 보드가 존재하지 않으면 에러 메시지 출력
    if (!board) {
      throw new NotFoundException(`존재하지 않는 보드입니다.`);
    }

    // 사용자가 보드 멤버인지 확인
    const isMember = await this.boardMemberRepository.findOne({
      where: { boardId: id, userId },
    });

    if (!isMember) {
      throw new UnauthorizedException('해당 보드에 접근할 권한이 없습니다.');
    }

    return board;
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

  // 보드 삭제
  async remove(id: number, userId: number): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`존재하지 않는 보드입니다.`);
    }

    // 보드의 소유자가 아닌 경우 예외 발생
    if (board.ownerId !== userId) {
      throw new UnauthorizedException('보드를 삭제할 권한이 없습니다.');
    }

    await this.boardRepository.remove(board);
  }

  // 보드 멤버 조회
  async getBoardMembers(boardId: number, userId: number): Promise<BoardMember[]> {
    // 사용자가 보드 멤버인지 확인
    const isMember = await this.boardMemberRepository.findOne({
      where: { boardId, userId },
    });

    if (!isMember) {
      throw new UnauthorizedException('해당 보드에 접근할 권한이 없습니다.');
    }

    return this.boardMemberRepository.find({
      where: { boardId },
      relations: ['user'],
    });
  }
}
