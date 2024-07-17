import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository, DataSource } from 'typeorm';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { LexoRank } from 'lexorank';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import { CardMember } from './entities/card-member.entity';
import { CreateCardMemberDto } from './dto/create-card-member.dto';

@Injectable()
export class CardService {
  queryRunner: any;
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(List) private readonly listRepository: Repository<List>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(CardMember) private readonly cardMemberRepository: Repository<CardMember>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const { listId, title, content, color } = createCardDto;
    // 카드 이름이 중복되었을때
    const existedCard = await this.cardRepository.findOneBy({
      title: title,
    });
    if (existedCard) throw new ConflictException('이미 사용중인 카드 이름입니다.');

    // LexoRank값 생성
    let lexoRank: LexoRank;
    // 해당 리스트의 (가장 lexoRank값이 가장 큰) = 첫번째 카드 찾기 =>
    const lastCard = await this.cardRepository.findOne({
      where: { listId },
      order: { lexoRank: 'DESC' },
    });
    // 리스트에 카드가 하나도 없다면 첫 카드는 Lexo값 중간값 지정
    // LexoRank값의 중간값 == 초기 LexoRank값을 생성할때 쓰임
    if (!lastCard) {
      lexoRank = LexoRank.middle();
    } else {
      // 리스트에 카드가 있다면, 첫번째에 위치한 카드의 lexoRank보다 큰 값 생성
      const lastListLexoRank = LexoRank.parse(lastCard.lexoRank);

      lexoRank = lastListLexoRank.genNext();
    }

    const data = await this.cardRepository.save({
      listId,
      title,
      content,
      color,
      // lexorank형식으로 되있으므로 entity에 명시된대로 string으로 바꿔주기
      lexoRank: lexoRank.toString(),
    });
    return data;
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
    await this.cardRepository.delete({
      id: id,
    });
    return card;
  }

  // 카드 순서 변경
  async reorderCardQueryRunner(cardId: number, reorderCardDto: ReorderCardDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 유효성 검사
      const { beforeId, afterId, ListId } = reorderCardDto;
      // 1. beforeId, afterId 중 최소 1개는 있어야 한다. 둘 다 없다면 false 반환
      // beforecard가 Null 이라면 첫번재 순서
      // aftercard가 Null 이라면 마지막 순서
      if (!beforeId && !afterId) throw new NotFoundException('beforeId, afterId 중 1개를 입력해주세요');

      // 2. 해당 리스트가 없을때 false 반환
      const existedList = await queryRunner.manager.findOneBy(List, { id: ListId });
      console.log(existedList);
      if (!existedList) throw new NotFoundException('해당 리스트가 없습니다.');

      // Id값으로 이동 했을때 전과 후의 카드 찾기
      const beforeCard = beforeId ? await queryRunner.manager.findOneBy(Card, { id: beforeId }) : null; // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 2번 리스트
      const afterCard = afterId ? await queryRunner.manager.findOneBy(Card, { id: afterId }) : null; // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 3번 리스트

      // 3, 해당 리스트 안에, 해당 카드가 없다면 false 반환
      // beforeId 혹은 afterId가 Null값을 줄 수 있는 경우를 제외해야한다.
      // 의도적으로 Null값을 줄 수는 있지만, 리스트 id에 맞게 찾았을때 카드가 null값이 나오면 안된다.
      if (afterId != null || beforeId != null) {
        const existedBeforeCard = beforeId
          ? await queryRunner.manager.findOneBy(Card, { id: beforeId, listId: ListId })
          : null;
        const existedAfterCard = afterId
          ? await queryRunner.manager.findOneBy(Card, { id: afterId, listId: ListId })
          : null;
        if ((beforeId && !existedBeforeCard) || (afterId && !existedAfterCard))
          throw new NotFoundException('해당 리스트에 해당 카드가 없습니다.');
      }

      // 만약 두 카드의 리스트 아이디가 다르다면 false 반환
      // 근데 위의 조건은 3번에 의해 에러가 날것이다. 3번 조건에 의해 처리될것이니 필요없다고 생각.
      //if (beforeCard.listId !== afterCard.listId) throw new NotFoundException('두 카드의 리스트 아이디가 다릅니다.');

      // 이전과 이후 카드의 lexoRank 값
      const beforeCardLexoRank = beforeCard ? LexoRank.parse(beforeCard.lexoRank) : null;
      const afterCardLexoRank = afterCard ? LexoRank.parse(afterCard.lexoRank) : null;
      // 4. lexoRank값은 전 > 후. 하지만 전 < 후가 된다면?
      // 근데 웹사이트에서는 카드를 옮기면 알아서 전과 후가 정해지는 것 같다. 왜지?
      // 유효성 검사 끝

      // 카드 변경 로직
      // 이동할 아이템에 새로 할당할 lexoRank 정의
      let lexoRank: LexoRank;

      // 이동할 위치에 따른 LexoRank값 할당
      // 1. 맨 처음-> 첫번째 위치한 카드의 LexoRank값에서 genPrev()를 이용해 더 작은 LexoRank값을 할당
      if (!beforeCard) lexoRank = afterCardLexoRank.genPrev();
      // 2. 맨 끝  -> 마지막에 위치한 카드의 LexoRank값에서 genNext()를 이용해 더 큰 LexoRank값을 할당
      else if (!afterCard) lexoRank = beforeCardLexoRank.genNext();
      // 3. 두 카드 사이 ->  between()을 이용해서 두 카드의 LexoRank값들의 사이값인 LexoRank값을 할당
      else lexoRank = beforeCardLexoRank.between(afterCardLexoRank);

      // 선택한 리스트와 변경된 lexoRank값 update하기
      const updateResult = await queryRunner.manager.update(Card, cardId, {
        listId: ListId,
        lexoRank: lexoRank.toString(),
      });
      console.log(updateResult);
      if (updateResult.affected === 0) {
        throw new Error('카드 업데이트에 실패했습니다.');
      }
      //
      // console.log('updateResult', updateResult);
      await queryRunner.commitTransaction(); // 트랜잭션 커밋

      // 업데이트된 카드 정보 반환
      const updatedCard = await this.cardRepository.findOne({ where: { id: cardId } });
      if (!updatedCard) {
        throw new NotFoundException('업데이트 된 카드를 찾을 수 없습니다.');
      }
      console.log(updatedCard);
      // await queryRunner.manager.save(updateResult);
      // return updatedCard;
      return true;
      // await this.findAll();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
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
