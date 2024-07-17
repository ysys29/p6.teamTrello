import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Repository } from 'typeorm';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { LexoRank } from 'lexorank';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import { CardMember } from './entities/card-member.entity';
import { CreateCardMemberDto } from './dto/create-card-member.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CardMember)
    private readonly cardMemberRepository: Repository<CardMember>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const { listId, title, content, color } = createCardDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 마지막 카드를 찾기
      const lastCard = await queryRunner.manager
        .createQueryBuilder(Card, 'card')
        .where('card.listId = :listId', { listId })
        .andWhere('card.nextCardId IS NULL')
        .setLock('pessimistic_write')
        .getOne();

      console.log('🚀 ~ CardService ~ create ~ lastCard:', lastCard);

      // 새로운 카드 생성
      const newCard = await queryRunner.manager.save(Card, {
        listId,
        title,
        content,
        color,
        nextCardId: null,
      });

      // 마지막 카드가 존재한다면, 그 카드의 nextCardId를 새로운 카드의 ID로 설정
      if (lastCard) {
        lastCard.nextCardId = newCard.id;
        await queryRunner.manager.save(Card, lastCard);
      }

      await queryRunner.commitTransaction();

      return newCard;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 카드 상세 조회
  async findOne(id: number) {
    // 카드를 가지고 있는지 여부 검사
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['cardMembers', 'comments'],
    });

    if (!card) throw new NotFoundException('카드를 찾을 수 없습니다.');

    return card;
  }

  // 카드 수정
  async update(id: number, updateCardDto: UpdateCardDto) {
    const { title, content, color, deadline } = updateCardDto;
    // 카드를 가지고 있는지 여부 검사
    const existedCard = this.findOne(id);
    if (!existedCard) throw new NotFoundException('카드를 찾을 수 없습니다.');

    // 수정할 데이터 업데이트
    // 제목, 내용, 색 중 1가지라도 있으면 수정이 된다.

    // 업데이트할 데이터의 조건
    const updateCondition = { id: id };
    // 업데이트할 데이터의 값
    const updateData: any = {
      ...(title !== null ? { title } : {}),
      ...(content !== null ? { content } : {}),
      ...(color !== null ? { color } : {}),
      ...(deadline !== null ? { deadline } : {}),
    };

    const data = await this.cardRepository.update(updateCondition, updateData);
    return data;
  }

  // 카드 삭제
  async remove(id: number) {
    // 카드를 가지고 있는지 여부 검사
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('카드를 찾을 수 없습니다.');

    // nextCardId로 삭제할 카드 앞의 카드를 검색함.
    const previousCard = await this.cardRepository.findOne({
      where: { nextCardId: id },
    });

    // 존재하면 삭제할 카드의 nextCardId를 previousCard의 nextCardId로 저장해서 연결
    if (previousCard) {
      previousCard.nextCardId = card.nextCardId;
      await this.cardRepository.save(previousCard);
    }

    await this.cardRepository.delete(id);
    return card;
  }

  // 카드 순서 변경
  async reorderCard(cardId: number, reorderCardDto: ReorderCardDto) {
    const { beforeId, afterId, listId } = reorderCardDto;

    if (!beforeId && !afterId) throw new NotFoundException('beforeId, afterId 중 1개를 입력해주세요');

    /**
     * beforeId && afterId : 중간으로 이동
     * 1. moving카드의 기존 연결 해제
     * movingCard의 nextCardId로 갖고 있던 이전 카드를 previousCard라 하면,
     * previousCard가 존재: previousCard의 nextCardId를 movingCardId의 nextCardId로 저장. null일 수도 있음.
     * previousCard가 존재하지 않음(movingCard가 맨 앞카드였을 때) : 그냥 다음 단계.
     *
     * 2. moving카드의 앞 뒤 연결
     * movingCard의 nextCardId에 beforeCard의 nextCardId를 저장 : 뒤에 연결.
     * beforeCard의 nextCardId를 movingCard의 id로 저장 : 앞에 연결.
     * */

    /**
     * !beforeId && afterId : 맨 뒤로 이동.
     * 1. moving카드의 기존 연결 해제
     * movingCard의 nextCardId로 갖고 있던 이전 카드를 previousCard라 하면,
     * previousCard가 존재: previousCard의 nextCardId를 movingCardId의 nextCardId로 저장. null일 수도 있음.
     * previousCard가 존재하지 않음(movingCard가 맨 앞카드였을 때) : 그냥 다음 단계.
     *
     * 2. moving카드의 앞 뒤 연결
     * movingCard의 nextCardId에 beforeCard의 nextCardId를 저장 : 뒤에 연결.
     * beforeCard의 nextCardId를 movingCard의 id로 저장 : 앞에 연결.
     * */

    /**
     * beforeId && !afterId : 맨 앞으로 이동.
     * 1. moving카드의 기존 연결 해제
     * movingCard의 nextCardId로 갖고 있던 이전 카드를 previousCard라 하면,
     * previousCard가 존재: previousCard의 nextCardId를 movingCardId의 nextCardId로 저장. null일 수도 있음.
     * previousCard가 존재하지 않음(movingCard가 맨 앞카드였을 때) : 그냥 다음 단계.
     *
     * 2. moving카드의 앞 뒤 연결
     * movingCard의 nextCardId에 beforeCard의 nextCardId를 저장 : 뒤에 연결.
     * beforeCard의 nextCardId를 movingCard의 id로 저장 : 앞에 연결.
     * */

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existedList = await queryRunner.manager.findOne(List, {
        where: { id: listId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!existedList) throw new NotFoundException('해당 리스트가 없습니다.');

      const movingCard = await queryRunner.manager.findOne(Card, {
        where: { id: cardId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!movingCard) throw new NotFoundException('카드를 찾을 수 없습니다.');

      let previousCard = null;
      if (beforeId) {
        const beforeCard = await queryRunner.manager.findOne(Card, {
          where: { id: beforeId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!beforeCard) throw new NotFoundException('beforeId에 해당하는 카드를 찾을 수 없습니다.');

        movingCard.nextCardId = beforeCard.nextCardId;
        beforeCard.nextCardId = movingCard.id;
        await queryRunner.manager.save(Card, beforeCard);
      }

      if (afterId) {
        const afterCard = await queryRunner.manager.findOne(Card, {
          where: { id: afterId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!afterCard) throw new NotFoundException('afterId에 해당하는 카드를 찾을 수 없습니다.');

        previousCard = await queryRunner.manager.findOne(Card, {
          where: { nextCardId: afterCard.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (previousCard) {
          previousCard.nextCardId = movingCard.id;
          await queryRunner.manager.save(Card, previousCard);
        }

        movingCard.nextCardId = afterCard.id;
      }

      // If the card was moved from being the last card, update the previous last card's nextCardId to null
      if (movingCard.nextCardId === null) {
        const previousLastCard = await queryRunner.manager.findOne(Card, {
          where: { listId, nextCardId: cardId },
          lock: { mode: 'pessimistic_write' },
        });

        if (previousLastCard) {
          previousLastCard.nextCardId = null;
          await queryRunner.manager.save(Card, previousLastCard);
        }
      }

      await queryRunner.manager.save(Card, movingCard);
      await queryRunner.commitTransaction();

      return await queryRunner.manager.findOne(Card, { where: { id: cardId } });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 작업자 할당
  async choiceWorker(cardId: number, createCardMeberDto: CreateCardMemberDto) {
    const { userId } = createCardMeberDto;
    // 카드아이디에 맞는 카드가 없다면
    const existedCard = await this.cardRepository.findOneBy({ id: cardId });
    if (!existedCard) throw new NotFoundException('카드 없음');

    // 유저아이디에 맞는 유저가 없다면

    const existedUser = await this.userRepository.findOneBy({ id: userId });
    if (!existedUser) throw new NotFoundException('유저 없음');

    // 유저가 이미 카드 작업자로 할당 되있다면 false반환
    const existedWorker = await this.cardMemberRepository.findOneBy({ userId: userId });
    if (existedWorker) throw new ConflictException('유저가 이미 등록되어있음.');
    //카드 작업자 할당 = 카드 작업자 데이터 생성
    const cardWorker = await this.cardMemberRepository.save({
      cardId,
      userId,
    });
    return cardWorker;
  }

  // 작업자 제거
  async deleteWorker(cardId: number, workerId: number) {
    //카드에 맞는 작업자가 있는지
    const findWorker = await this.cardMemberRepository.findOneBy({
      cardId: cardId,
      userId: workerId,
    });
    if (!findWorker) throw new NotFoundException('해당 카드에 맞는 작업자가 없습니다.');

    const worker = await this.cardMemberRepository.delete({
      cardId,
      userId: workerId,
    });
    return worker;
  }
}
