import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { LexoRank } from 'lexorank';
import { List } from 'src/list/entities/list.entity';
@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const { listId, title, content, color } = createCardDto;
    // 카드 이름이 중복되었을때
    const existedCard = await this.cardRepository.findOneBy({
      title: title,
    });
    if (existedCard) throw new BadRequestException('이미 사용중인 카드 이름입니다.');

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
  // 카드 목록 조회
  async findAll() {
    const cards = await this.cardRepository.find({
      select: ['id', 'listId', 'title', 'content', 'color', 'deadline', 'lexoRank'],
      order: {
        lexoRank: 'DESC',
      },
    });
    return cards;
  }
  // 카드 상세 조회
  async findOne(id: number) {
    // 카드를 가지고 있는지 여부 검사
    const card = await this.cardRepository.findOne({
      where: { id },
    });
    if (!card) throw new NotFoundException('카드를 찾을 수 없습니다.');
    return card;
  }

  // 카드 수정
  async update(id: number, updateCardDto: UpdateCardDto) {
    const { listId, title, content, color } = updateCardDto;
    // 카드를 가지고 있는지 여부 검사
    const card = this.findOne(id);
    if (!card) throw new NotFoundException('카드를 찾을 수 없습니다.');
    const data = await this.cardRepository.save({
      listId,
      title,
      content,
      color,
    });
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
  async reorderCard(cardId: number, reorderCardDto: ReorderCardDto) {
    // 유효성 검사
    const { beforeId, afterId, ListId } = reorderCardDto;
    // 1. beforeId, afterId 중 최소 1개는 있어야 한다. 둘 다 없다면 false 반환
    // beforecard가 Null 이라면 첫번재 순서
    // aftercard가 Null 이라면 마지막 순서
    if (!beforeId && !afterId) throw new NotFoundException('beforeId, afterId 중 1개를 입력해주세요');

    // 2. 해당 리스트가 없을때 false 반환
    const existedList = await this.listRepository.findOneBy({ id: ListId });
    if (!existedList) throw new NotFoundException('해당 리스트가 없습니다.');

    // Id값으로 이동 했을때 전과 후의 카드 찾기
    const beforeCard = beforeId ? await this.cardRepository.findOneBy({ id: beforeId }) : null; // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 2번 리스트
    const afterCard = afterId ? await this.cardRepository.findOneBy({ id: afterId }) : null; // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 3번 리스트

    // 3, 해당 리스트 안에, 해당 카드가 없다면 false 반환
    // beforeId 혹은 afterId가 Null값을 줄 수 있는 경우를 제외해야한다.
    // 의도적으로 Null값을 줄 수는 있지만, 리스트 id에 맞게 찾았을때 카드가 null값이 나오면 안된다.
    if (afterId != null || beforeId != null) {
      const existedBeforeCard = await this.cardRepository.findOneBy({ id: beforeId, listId: ListId });
      const existedAfterCard = await this.cardRepository.findOneBy({ id: afterId, listId: ListId });
      if (!existedBeforeCard || !existedAfterCard) throw new NotFoundException('해당 리스트에 해당 카드가 없습니다.');
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
    if (!beforeCard) lexoRank = afterCardLexoRank.genNext();
    // 2. 맨 끝  -> 마지막에 위치한 카드의 LexoRank값에서 genNext()를 이용해 더 큰 LexoRank값을 할당
    else if (!afterCard) lexoRank = beforeCardLexoRank.genPrev();
    // 3. 두 카드 사이 ->  between()을 이용해서 두 카드의 LexoRank값들의 사이값인 LexoRank값을 할당
    else lexoRank = beforeCardLexoRank.between(afterCardLexoRank);

    // 선택한 리스트와 변경된 lexoRank값 update하기
    await this.cardRepository.update(cardId, {
      listId: ListId,
      lexoRank: lexoRank.toString(),
    });
    return await this.findAll();
  }
}
