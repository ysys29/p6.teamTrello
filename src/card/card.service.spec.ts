import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import { CardMember } from './entities/card-member.entity';
import { Card } from './entities/card.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dummyCreateCardDto } from './dummies/cards.dummy';
import { dummyCardJoinCardMmber } from './dummies/cards.dummy';
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
});

describe('CardService test code', () => {
  let cardService: CardService;
  let mockCardRepository: MockRepository<Card>;
  let mockListRepository: MockRepository<List>;
  let mockUserRepository: MockRepository<User>;
  let mockCardMemberRepository: MockRepository<CardMember>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        { provide: getRepositoryToken(Card), useFactory: mockRepository },
        { provide: getRepositoryToken(List), useFactory: mockRepository },
        { provide: getRepositoryToken(User), useFactory: mockRepository },
        { provide: getRepositoryToken(CardMember), useFactory: mockRepository },
      ],
    }).compile();

    cardService = module.get<CardService>(CardService);
    mockCardRepository = module.get(getRepositoryToken(Card));
    mockListRepository = module.get(getRepositoryToken(List));
    mockUserRepository = module.get(getRepositoryToken(User));
    mockCardMemberRepository = module.get(getRepositoryToken(CardMember));
  });

  // 카드 생성 메서드 테스트
  describe('createCard method', () => {
    it('카드 이름이 중복되었을때 에러', async () => {
      // GIVEN

      const mockCreateCardDto = dummyCreateCardDto;

      mockCardRepository.findOneBy.mockResolvedValue('A');

      // WHEN
      const create = cardService.create(mockCreateCardDto);

      // THEN
      await expect(create).rejects.toThrow(
        expect.objectContaining({
          name: 'ConflictException',
          message: '이미 사용중인 카드 이름입니다.',
        }),
      );
      expect(mockCardRepository.findOneBy).toHaveBeenCalledWith({
        title: mockCreateCardDto.title,
      });
      expect(mockCardRepository.save).toHaveBeenCalledTimes(0);
    });
  });

  // 카드 상세 조회 메서드 테스트
  describe('findOneCard method ', () => {
    it('해당하는 카드가 없을 때 에러', async () => {
      // GIVEN
      const mockCardId = 1;
      mockCardRepository.findOneBy.mockResolvedValue(null);
      // WHEN
      const card = cardService.findOne(mockCardId);
      // THEN
      await expect(card).rejects.toThrow(
        expect.objectContaining({
          name: 'NotFoundException',
          message: '카드를 찾을 수 없습니다.',
        }),
      );
      expect(mockCardRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCardId },
        relations: ['cardMembers'],
      });
    });
  });

  it('상세 조회 성공', async () => {
    //GIVEN
    const mockCardId = 1;
    const mockCard = dummyCardJoinCardMmber;
    mockCardRepository.findOne.mockResolvedValue(mockCard);
    //WHEN
    const card = await cardService.findOne(mockCardId);
    //THEN

    expect(card).toEqual({
      id: mockCard.id,
      listId: mockCard.listId,
      title: mockCard.title,
      content: mockCard.content,
      color: mockCard.color,
      lexoRank: mockCard.lexoRank,
      deadline: mockCard.deadline,
      createdAt: mockCard.createdAt,
      updatedAt: mockCard.updatedAt,
      deletedAt: mockCard.deletedAt,
      cardMembers: mockCard.cardMembers.map((cardMember) => ({
        id: cardMember.id,
        cardId: cardMember.cardId,
        userId: cardMember.userId,
        createdAt: cardMember.createdAt,
        updatedAt: cardMember.updatedAt,
      })),
    });

    expect(mockCardRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockCardId },
      relations: ['cardMembers'],
    });
  });

  // 카드 삭제 메서드 테스트
  describe('remove method', () => {
    it('해당하는 카드가 없을 때 에러', async () => {
      // GIVEN
      const mockCardId = 1;
      mockCardRepository.findOneBy.mockResolvedValue(null);
      // WHEN
      const card = cardService.findOne(mockCardId);
      // THEN
      await expect(card).rejects.toThrow(
        expect.objectContaining({
          name: 'NotFoundException',
          message: '카드를 찾을 수 없습니다.',
        }),
      );
    });
    it('카드 삭제 성공', async () => {
      // GIVEN
      const mockCardId = 1;
      const mockCard = dummyCardJoinCardMmber;
      mockCardRepository.findOneBy.mockResolvedValue(mockCard);
      // WHEN
      //cardService.delete(mockCardId);
      // THEN
      expect(mockCardRepository.delete).toHaveBeenCalledWith({
        id: mockCardId,
      });
    });
  });
});
