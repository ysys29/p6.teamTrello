import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { LexoRank } from 'lexorank';
@Injectable()
export class CardService {
  @InjectRepository(Card) private readonly cardRepository: Repository<Card>;

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
    const { beforeId, afterId, ListId } = reorderCardDto;
    // 만약 2개 중 하나라도 있어야된다.
    // beforecard가 Null 이라면 첫번재 순서
    // aftercard가 Null 이라면 마지막 순서
    if (!beforeId && !afterId) throw new NotFoundException('beforeId, afterId 중 1개를 입력해주세요');

    //해당 리스트가 없을때 False 반환

    // 이동 후 이전과 이후에 위치할 카드 찾기
    const beforeCard = beforeId ? await this.cardRepository.findOneBy({ id: beforeId }) : null; // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 2번 리스트
    const afterCard = afterId ? await this.cardRepository.findOneBy({ id: afterId }) : null; // ex) 6번 리스트를 2번과 3번 사이로 이동시킨다면 3번 리스트

    // 해당 리스트 안에, 해당 카드가 없다면 false 반환
    // beforeId 혹은 afterId가 Null값을 줄 수 있는 경우를 제외해야한다.
    if (afterId != null || beforeId != null) {
      const existedBeforeCard = await this.cardRepository.findOneBy({ id: beforeId, listId: ListId });
      const existedAfterCard = await this.cardRepository.findOneBy({ id: afterId, listId: ListId });
      if (!existedBeforeCard || !existedAfterCard) throw new NotFoundException('해당 리스트에 해당 카드가 없습니다.');
    }

    //만약 두 카드의 리스트 아이디가 다르다면 false 반환
    if (beforeCard.listId !== afterCard.listId) throw new NotFoundException('두 카드의 리스트 아이디가 다릅니다.');

    // 이전과 이후 카드의 lexoRank 값
    const beforeCardLexoRank = beforeCard ? LexoRank.parse(beforeCard.lexoRank) : null;
    const afterCardLexoRank = afterCard ? LexoRank.parse(afterCard.lexoRank) : null;
    console.log(beforeCardLexoRank);
    console.log(afterCardLexoRank);
    console.log('zzz');
    // 이동할 아이템에 새로 할당할 lexoRank 정의
    let lexoRank: LexoRank;
    // 2번의

    // 이동할 위치
    // 1. 맨 처음-> 첫번째 위치한 카드의 LexoRank값에서 genPrev()를 이용해 더 작은 LexoRank값을 할당
    if (!beforeCard) lexoRank = afterCardLexoRank.genPrev();
    // 2. 맨 끝  -> 마지막에 위치한 카드의 LexoRank값에서 genNext()를 이용해 더 큰 LexoRank값을 할당
    else if (!afterCard) lexoRank = beforeCardLexoRank.genNext();
    // 3. 두 카드 사이 ->  between()을 이용해서 두 카드의 LexoRank값들의 사이값인 LexoRank값을 할당
    else lexoRank = beforeCardLexoRank.between(afterCardLexoRank);
    console.log('zzzzzzzzzzzzzzzzzzz');
    console.log(lexoRank);
    //await this.cardRepository.save({ lexoRank: lexoRank.toString() });
    const data = await this.cardRepository.update(cardId, {
      listId: ListId,
      lexoRank: lexoRank.toString(),
    });
    await this.findAll();
    return true;
  }
}
