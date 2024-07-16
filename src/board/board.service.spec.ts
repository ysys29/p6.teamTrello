import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { List } from '../list/entities/list.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('BoardService', () => {
  let service: BoardService;
  let boardRepository: MockRepository<Board>;
  let boardMemberRepository: MockRepository<BoardMember>;
  let listRepository: MockRepository<List>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        { provide: getRepositoryToken(Board), useFactory: mockRepository },
        { provide: getRepositoryToken(BoardMember), useFactory: mockRepository },
        { provide: getRepositoryToken(List), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    boardRepository = module.get<MockRepository<Board>>(getRepositoryToken(Board));
    boardMemberRepository = module.get<MockRepository<BoardMember>>(getRepositoryToken(BoardMember));
    listRepository = module.get<MockRepository<List>>(getRepositoryToken(List));
  });

  describe('create', () => {
    it('새로운 보드를 생성하고 사용자를 멤버로 추가해야 합니다.', async () => {
      // Given
      const createBoardDto: CreateBoardDto = { title: 'New Board', description: 'Board Description', color: '#FFFFFF' };
      const userId = 1;
      const mockBoard = { id: 1, ...createBoardDto, ownerId: userId };
      const mockBoardMember = { id: 1, boardId: mockBoard.id, userId };

      boardRepository.create.mockReturnValue(mockBoard);
      boardRepository.save.mockResolvedValue(mockBoard);
      boardMemberRepository.create.mockReturnValue(mockBoardMember);
      boardMemberRepository.save.mockResolvedValue(mockBoardMember);

      // When
      const result = await service.create(createBoardDto, userId);

      // Then
      expect(boardRepository.create).toHaveBeenCalledWith({ ...createBoardDto, ownerId: userId });
      expect(boardRepository.save).toHaveBeenCalledWith(mockBoard);
      expect(boardMemberRepository.create).toHaveBeenCalledWith({ boardId: mockBoard.id, userId });
      expect(boardMemberRepository.save).toHaveBeenCalledWith(mockBoardMember);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('findOne', () => {
    it('보드가 존재하지 않으면 NotFoundException을 발생시켜야 합니다.', async () => {
      // Given
      const boardId = 1;
      const userId = 1;

      boardRepository.findOne.mockResolvedValue(null);

      // When
      const result = service.findOne(boardId, userId);

      // Then
      await expect(result).rejects.toThrow(
        expect.objectContaining({
          name: 'NotFoundException',
          message: '존재하지 않는 보드입니다.',
        }),
      );
    });

    it('사용자가 보드의 멤버가 아니면 UnauthorizedException을 발생시켜야 합니다.', async () => {
      // Given
      const boardId = 1;
      const userId = 1;
      const mockBoard = { id: boardId, boardMembers: [], lists: [] };

      boardRepository.findOne.mockResolvedValue(mockBoard);
      boardMemberRepository.findOne.mockResolvedValue(null);

      // When
      const result = service.findOne(boardId, userId);

      // Then
      await expect(result).rejects.toThrow(
        expect.objectContaining({
          name: 'UnauthorizedException',
          message: '해당 보드에 접근할 권한이 없습니다.',
        }),
      );
    });

    it('사용자가 보드의 멤버이면 보드 상세 정보와 정렬된 리스트를 반환해야 합니다.', async () => {
      // Given
      const boardId = 1;
      const userId = 1;
      const mockBoard = {
        id: boardId,
        title: 'Test Board',
        description: 'Test Description',
        color: '#FFFFFF',
        createdAt: new Date(),
        updatedAt: new Date(),
        boardMembers: [{ id: 1, userId: userId }],
        lists: [],
      };
      const mockLists = [
        { id: 1, title: 'List 1', lexoRank: '0|abc' },
        { id: 2, title: 'List 2', lexoRank: '0|abd' },
      ];

      boardRepository.findOne.mockResolvedValue(mockBoard);
      boardMemberRepository.findOne.mockResolvedValue(true);
      listRepository.find.mockResolvedValue(mockLists);

      // When
      const result = await service.findOne(boardId, userId);

      // Then
      expect(result).toEqual({
        id: mockBoard.id,
        title: mockBoard.title,
        description: mockBoard.description,
        color: mockBoard.color,
        createdAt: mockBoard.createdAt,
        updatedAt: mockBoard.updatedAt,
        boardMembers: mockBoard.boardMembers.map((member) => ({
          id: member.id,
          userId: member.userId,
        })),
        lists: mockLists.map((list) => ({
          id: list.id,
          title: list.title,
        })),
      });
      expect(listRepository.find).toHaveBeenCalledWith({
        where: { boardId: mockBoard.id },
        order: { lexoRank: 'ASC' },
      });
    });
  });
});
