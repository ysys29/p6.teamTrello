import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { DataSource, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LexoRank } from 'lexorank';
import { dummyCreateListDto, dummyListWithBoard, dummyListWithBoardAndCards, dummyLists } from './dummies/lists.dummy';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

// 리스트 서비스 테스트 코드
describe('ListService test code', () => {
  let listService: ListService;
  let mockListRepository: MockRepository<List>;
  let mockBoardRepository: MockRepository<Board>;
  let mockBoardMemberRepository: MockRepository<BoardMember>;
  let mockDataSourceProvider: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        { provide: getRepositoryToken(List), useFactory: mockRepository },
        { provide: getRepositoryToken(Board), useFactory: mockRepository },
        { provide: getRepositoryToken(BoardMember), useFactory: mockRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    listService = module.get<ListService>(ListService);
    mockListRepository = module.get(getRepositoryToken(List));
    mockBoardRepository = module.get(getRepositoryToken(Board));
    mockBoardMemberRepository = module.get(getRepositoryToken(BoardMember));
    mockDataSourceProvider = module.get<DataSource>(DataSource);

    // 모든 mock 함수 초기화
    jest.clearAllMocks();
  });

  // 리스트 생성 메서드 테스트
  describe('createList method', () => {
    test('해당하는 아이디의 보드가 없을 때 에러', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockCreateListDto = dummyCreateListDto;

      mockBoardRepository.findOneBy.mockResolvedValue(null);

      // WHEN
      const createdList = listService.createList(mockUserId, mockCreateListDto);

      // THEN
      await expect(createdList).rejects.toThrow(
        expect.objectContaining({
          name: 'NotFoundException',
          message: '해당하는 아이디의 보드가 없습니다.',
        }),
      );
      expect(mockBoardRepository.findOneBy).toHaveBeenCalledWith({
        id: dummyCreateListDto.boardId,
      });
      expect(mockListRepository.save).toHaveBeenCalledTimes(0);
    });

    test('해당 리스트에 권한이 없으면 에러', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockCreateListDto = dummyCreateListDto;
      const mockBoard = dummyListWithBoard.board;

      mockBoardRepository.findOneBy.mockResolvedValue(mockBoard);
      mockBoardMemberRepository.findOne.mockResolvedValue(null);

      // WHEN
      const createdList = listService.createList(mockUserId, mockCreateListDto);

      // THEN
      await expect(createdList).rejects.toThrow(
        expect.objectContaining({
          name: 'UnauthorizedException',
          message: '해당 리스트에 권한이 없습니다.',
        }),
      );
      expect(mockBoardMemberRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardMemberRepository.findOne).toHaveBeenCalledWith({
        where: { boardId: mockCreateListDto.boardId, userId: mockUserId },
      });
      expect(mockListRepository.save).toHaveBeenCalledTimes(0);
    });

    test('보드에 리스트가 없을 때 middle로 lexoRank 생성 및 저장', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockCreateListDto = dummyCreateListDto;
      const mockBoard = dummyListWithBoard.board;
      const mockList = dummyLists[0];
      const mockLexoRank = LexoRank.middle();

      mockBoardRepository.findOneBy.mockResolvedValue(mockBoard);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockListRepository.findOne.mockResolvedValue(null);
      mockListRepository.save.mockResolvedValue(mockList);

      // WHEN
      const createdList = await listService.createList(mockUserId, mockCreateListDto);

      // THEN
      expect(createdList).toEqual({
        id: mockList.id,
        title: mockList.title,
      });
      expect(mockListRepository.save).toHaveBeenCalledTimes(1);
      expect(mockListRepository.save).toHaveBeenCalledWith({
        boardId: mockCreateListDto.boardId,
        title: mockCreateListDto.title,
        lexoRank: mockLexoRank.toString(),
      });
    });

    test('보드에 리스트가 존재할 때 genNext로 lexoRank 생성 및 저장', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockCreateListDto = dummyCreateListDto;
      const mockBoard = dummyListWithBoard.board;
      const mockExistingList = dummyLists[0];
      const mockLexoRank = LexoRank.parse(mockExistingList.lexoRank).genNext();
      const mockList = dummyLists[1];

      mockBoardRepository.findOneBy.mockResolvedValue(mockBoard);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockListRepository.findOne.mockResolvedValue(mockExistingList);
      mockListRepository.save.mockResolvedValue(mockList);

      // WHEN
      const createdList = await listService.createList(mockUserId, mockCreateListDto);

      // THEN
      expect(createdList).toEqual({
        id: mockList.id,
        title: mockList.title,
      });
      expect(mockListRepository.save).toHaveBeenCalledTimes(1);
      expect(mockListRepository.save).toHaveBeenCalledWith({
        boardId: mockCreateListDto.boardId,
        title: mockCreateListDto.title,
        lexoRank: mockLexoRank.toString(),
      });
    });
  });

  // 리스트 상세 조회 메서드 테스트
  describe('getList method', () => {
    test('리스트 상세 조회 성공', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockList = dummyListWithBoardAndCards;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);

      // WHEN
      const list = await listService.getList(mockUserId, mockListId);

      // THEN // 내일 여쭤봐야지
      expect(list).toEqual({
        id: mockList.id,
        title: mockList.title,
        cards: mockList.cards.map((card) => ({
          cardId: card.id,
          title: card.title,
          deadline: card.deadline,
        })),
      });
      expect(list.cards).toEqual([
        { cardId: 3, title: 'Dummy Card 3', deadline: '2024-07-25T23:38:14.927Z' },
        { cardId: 1, title: 'Dummy Card 1', deadline: '2024-07-25T23:38:14.927Z' },
        { cardId: 2, title: 'Dummy Card 2', deadline: '2024-07-25T23:38:14.927Z' },
      ]);
      expect(mockListRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockListId },
        relations: ['cards', 'board'],
      });
    });
  });

  // 리스트 이름 수정 메스트 테스트
  describe('updateListTitle method', () => {
    test('리스트 이름 수정 성공', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockUpdateTitle = 'Update List Title';
      const mockList = dummyListWithBoard;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockListRepository.save.mockResolvedValue({ ...mockList, title: mockUpdateTitle });

      // WHEN
      const updatedList = await listService.updateListTitle(mockUserId, mockListId, { title: mockUpdateTitle });

      // THEN
      expect(mockListRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockListId },
        relations: ['board'],
      });
      expect(updatedList).toEqual(mockUpdateTitle);
      expect(mockListRepository.save).toHaveBeenCalledTimes(1);
      expect(mockListRepository.save).toHaveBeenCalledWith({
        ...mockList,
        title: mockUpdateTitle,
      });
    });
  });

  // 리스트 순서 변경 메서드 테스트
  describe('reorderList method', () => {
    test('첫번째로 리스트 이동 성공', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 3;
      const mockAfterId = 1;
      const mockAfterList = dummyLists[0];
      const mockList = { ...dummyLists[2], board: { id: 1 } };
      const mockNewLexoRank = LexoRank.parse(mockAfterList.lexoRank).genPrev();
      const mockUpdatedList = { ...mockList, lexoRank: mockNewLexoRank.toString() };

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockListRepository.create.mockReturnValue(mockUpdatedList);
      mockQueryRunner.manager.findOne.mockResolvedValue(mockAfterList);
      mockQueryRunner.manager.save.mockResolvedValue(mockUpdatedList);

      // WHEN
      const result = await listService.reorderList(mockUserId, mockListId, { afterId: mockAfterId });

      // THEN
      expect(result).toEqual(true);
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(List, {
        where: { id: mockAfterId },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(List, mockUpdatedList);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    test('리스트 사이로 이동 성공', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockBeforeId = 3;
      const mockAfterId = 4;

      const mockBeforeList = dummyLists[2];
      const mockAfterList = dummyLists[3];
      const mockList = { ...dummyLists[0], board: { id: 1 } };

      const mockBeforeListLexoRank = LexoRank.parse(mockBeforeList.lexoRank);
      const mockAfterListLexoRank = LexoRank.parse(mockAfterList.lexoRank);
      const mockNewLexoRank = mockBeforeListLexoRank.between(mockAfterListLexoRank);
      const mockUpdatedList = { ...mockList, lexoRank: mockNewLexoRank.toString() };

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockQueryRunner.manager.findOne.mockResolvedValueOnce(mockBeforeList).mockResolvedValueOnce(mockAfterList);
      mockListRepository.create.mockReturnValue(mockUpdatedList);
      mockQueryRunner.manager.save.mockResolvedValue(mockUpdatedList);

      // WHEN
      const result = await listService.reorderList(mockUserId, mockListId, {
        beforeId: mockBeforeId,
        afterId: mockAfterId,
      });

      // THEN
      expect(result).toEqual(true);
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(List, {
        where: { id: mockBeforeId },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(List, {
        where: { id: mockAfterId },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(List, mockUpdatedList);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    test('마지막으로 리스트 이동 성공', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockBeforeId = 5;
      const mockBeforeList = dummyLists[4];
      const mockList = { ...dummyLists[0], board: { id: 1 } };
      const mockNewLexoRank = LexoRank.parse(mockBeforeList.lexoRank).genNext();
      const mockUpdatedList = { ...mockList, lexoRank: mockNewLexoRank.toString() };

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockQueryRunner.manager.findOne.mockResolvedValue(mockBeforeList);
      mockListRepository.create.mockReturnValue(mockUpdatedList);
      mockQueryRunner.manager.save.mockResolvedValue(mockUpdatedList);

      // WHEN
      const result = await listService.reorderList(mockUserId, mockListId, { beforeId: mockBeforeId });

      // THEN
      expect(result).toEqual(true);
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(List, {
        where: { id: mockBeforeId },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(List, mockUpdatedList);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    test('beforeId와 afterId 둘 다 입력 안했을 떄 에러', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockList = dummyListWithBoard;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);

      // WHEN
      const result = listService.reorderList(mockUserId, mockListId, {});

      // THEN
      await expect(result).rejects.toThrow(
        expect.objectContaining({
          name: 'BadRequestException',
          message: 'beforeId와 afterId 둘 중 하나는 입력해 주세요.',
        }),
      );
      expect(mockListRepository.save).toHaveBeenCalledTimes(0);
    });

    test('id는 있는데 해당 아이디의 리스트가 없을 때 에러', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockBeforeId = 5;
      const mockList = dummyListWithBoard;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      // WHEN
      const result = listService.reorderList(mockUserId, mockListId, { beforeId: mockBeforeId });

      // THEN
      await expect(result).rejects.toThrow(
        expect.objectContaining({
          name: 'BadRequestException',
          message: '리스트가 변경되었으니 다시 호출해 주세요.',
        }),
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(0);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });
  });

  // 리스트 삭제 메서드 테스트
  describe('deleteList method', () => {
    test('리스트 삭제 성공', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockList = dummyListWithBoard;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);

      // WHEN
      const result = await listService.deleteList(mockUserId, mockListId);

      // THEN
      expect(mockListRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockListId },
        relations: ['board'],
      });
      expect(result).toEqual(true);
      expect(mockListRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(mockListRepository.softDelete).toHaveBeenCalledWith({ id: mockListId });
    });
  });

  // 리스트 접근 권한 체크 메서드 테스트
  describe('validateListAccess method', () => {
    test('해당하는 아이디의 리스트가 없을 때 에러', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;

      mockListRepository.findOne.mockResolvedValue(null);

      // WHEN
      const list = listService.validateListAccess({ userId: mockUserId, listId: mockListId });

      // THEN
      await expect(list).rejects.toThrow(
        expect.objectContaining({
          name: 'NotFoundException',
          message: '해당 아이디에 해당하는 리스트가 없습니다.',
        }),
      );
      expect(mockListRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardMemberRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('해당 리스트에 접근 권한이 없을 때 에러', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockList = dummyListWithBoard;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(null);

      // WHEN
      const list = listService.validateListAccess({ userId: mockUserId, listId: mockListId });

      // THEN
      await expect(list).rejects.toThrow(
        expect.objectContaining({
          name: 'UnauthorizedException',
          message: '해당 리스트에 접근 권한이 없습니다.',
        }),
      );
      expect(mockBoardMemberRepository.findOne).toHaveBeenCalledTimes(1);
    });

    test('접근 권한이 있고 relation 매개변수를 받지 않았을 때', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const mockList = dummyListWithBoard;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);

      // WHEN
      const list = await listService.validateListAccess({ userId: mockUserId, listId: mockListId });

      // THEN
      expect(mockListRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockListRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockListId },
        relations: ['board'],
      });
      expect(mockBoardMemberRepository.findOne).toHaveBeenCalledTimes(1);
    });

    test('접근 권한이 있고 relation 매개변수를 true로 받았을 때', async () => {
      // GIVEN
      const mockUserId = 1;
      const mockListId = 1;
      const relation = true;
      const mockList = dummyListWithBoardAndCards;

      mockListRepository.findOne.mockResolvedValue(mockList);
      mockBoardMemberRepository.findOne.mockResolvedValue(true);

      // WHEN
      const list = await listService.validateListAccess({ userId: mockUserId, listId: mockListId, relation });

      // THEN
      expect(mockListRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockListRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockListId },
        relations: ['cards', 'board'],
      });
      expect(mockBoardMemberRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
