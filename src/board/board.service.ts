import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  // 보드 생성
  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    // DTO를 사용하여 새 보드 객체 생성
    const board = this.boardRepository.create(createBoardDto);
    // 생성된 보드 객체를 데이터베이스에 저장
    return this.boardRepository.save(board);
  }
  //보드목록검색 추가구현 사항임 일단은
  findAll() {
    return `This action returns all board`;
  }
  // 보드 상세 조회
  async findOne(id: number): Promise<Board> {
    // 주어진 ID로 보드 객체를 조회
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['user', 'boardMembers', 'lists'],
      //보드 멤버들이랑 리스트들도 받아옴
    });
    // 보드가 존재하지 않으면 에러메세지 뱉어냄 id없으면
    if (!board) {
      throw new NotFoundException(`존재하지 않는 보드입니다.`);
    }
    return board;
  }
  //보드 수정
  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }
  //보드 삭제
  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
