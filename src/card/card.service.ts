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

  // 카드 생성
  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const { listId, title, content, color } = createCardDto;

    // 마지막 카드를 찾아서 parent 설정
    const lastCard = await this.cardRepository.findOne({
      where: { listId },
      order: { id: 'DESC' },
    });

    const parent = lastCard ? lastCard.id : 0;

    const card = this.cardRepository.create({
      listId,
      title,
      content,
      color,
      parent,
    });

    return this.cardRepository.save(card);
  }

  // 카드 순서 변경
  // 카드 순서 변경
  async reorderCard(cardId: number, reorderCardDto: ReorderCardDto) {
    const { beforeId, afterId, listId } = reorderCardDto;

    if (!beforeId && !afterId) throw new NotFoundException('beforeId, afterId 중 1개를 입력해주세요');

    const existedList = await this.cardRepository.findOne({ where: { listId } });
    if (!existedList) throw new NotFoundException('해당 리스트가 없습니다.');

    const movingCard = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!movingCard) throw new NotFoundException('카드를 찾을 수 없습니다.');

    if (beforeId) {
      const beforeCard = await this.cardRepository.findOne({ where: { id: beforeId } });
      if (!beforeCard) throw new NotFoundException('beforeId에 해당하는 카드를 찾을 수 없습니다.');

      movingCard.parent = beforeCard.id;

      // B 카드의 parent를 D 카드로 변경
      const afterCard = await this.cardRepository.findOne({
        where: { parent: beforeCard.id },
      });

      if (afterCard) {
        afterCard.parent = movingCard.id;
        await this.cardRepository.save(afterCard);
      }
    }

    if (afterId) {
      const afterCard = await this.cardRepository.findOne({ where: { id: afterId } });
      if (!afterCard) throw new NotFoundException('afterId에 해당하는 카드를 찾을 수 없습니다.');

      const previousCard = await this.cardRepository.findOne({
        where: { parent: afterCard.id },
      });

      if (previousCard) {
        previousCard.parent = movingCard.id;
        await this.cardRepository.save(previousCard);
      }

      movingCard.parent = afterCard.id;
    }

    await this.cardRepository.save(movingCard);

    return movingCard;
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

  // // 카드 삭제
  // async remove(id: number) {
  //   // 카드를 가지고 있는지 여부 검사
  //   const card = await this.findOne(id);
  //   if (!card) throw new NotFoundException('카드를 찾을 수 없습니다.');

  //   // nextCardId로 삭제할 카드 앞의 카드를 검색함.
  //   const previousCard = await this.cardRepository.findOne({
  //     where: { nextCardId: id },
  //   });

  //   // 존재하면 삭제할 카드의 nextCardId를 previousCard의 nextCardId로 저장해서 연결
  //   if (previousCard) {
  //     previousCard.nextCardId = card.nextCardId;
  //     await this.cardRepository.save(previousCard);
  //   }

  //   await this.cardRepository.delete(id);
  //   return card;
  // }

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
