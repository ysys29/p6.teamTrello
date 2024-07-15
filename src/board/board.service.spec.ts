import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { Repository } from 'typeorm';

describe('BoardService', () => {
  let service: BoardService;
  let boardRepository: Repository<Board>;
  let boardMemberRepository: Repository<BoardMember>;

  beforeEach(async () => {
    // 테스트 모듈 설정
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        // Board 엔티티에 대한 Repository 주입
        {
          provide: getRepositoryToken(Board),
          useClass: Repository,
        },
        // BoardMember 엔티티에 대한 Repository 주입
        {
          provide: getRepositoryToken(BoardMember),
          useClass: Repository,
        },
      ],
    }).compile();

    // 서비스와 리포지토리 인스턴스 가져오기
    service = module.get<BoardService>(BoardService);
    boardRepository = module.get<Repository<Board>>(getRepositoryToken(Board));
    boardMemberRepository = module.get<Repository<BoardMember>>(getRepositoryToken(BoardMember));
  });

  // 서비스가 정의되었는지 확인
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new board and add the creator as a board member', async () => {
      // 테스트용 보드 생성 DTO와 사용자 ID 정의
      const createBoardDto = {
        title: 'New Board',
        description: 'This is a new board',
        color: '#FFFFFF',
      };
      const userId = 1;

      // 모의 객체 생성
      const createdBoard = {
        id: 1,
        ...createBoardDto,
        ownerId: userId,
      };

      const createdBoardMember = {
        id: 1,
        boardId: createdBoard.id,
        userId: userId,
      };

      // 리포지토리 메서드 모킹
      jest.spyOn(boardRepository, 'create').mockReturnValue(createdBoard as any);
      jest.spyOn(boardRepository, 'save').mockResolvedValue(createdBoard as any);
      jest.spyOn(boardMemberRepository, 'create').mockReturnValue(createdBoardMember as any);
      jest.spyOn(boardMemberRepository, 'save').mockResolvedValue(createdBoardMember as any);

      // 서비스의 create 메서드 호출 및 결과 검증
      const result = await service.create(createBoardDto, userId);

      // 기대한 결과와 실제 결과 비교
      expect(result).toEqual(createdBoard);
      expect(boardRepository.create).toHaveBeenCalledWith({ ...createBoardDto, ownerId: userId });
      expect(boardRepository.save).toHaveBeenCalledWith(createdBoard);
      expect(boardMemberRepository.create).toHaveBeenCalledWith({
        boardId: createdBoard.id,
        userId: userId,
      });
      expect(boardMemberRepository.save).toHaveBeenCalledWith(createdBoardMember);
    });
  });
});
