import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';

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
    const data = await this.cardRepository.save({
      listId,
      title,
      content,
      color,
    });
    return data;
  }
  // 카드 목록 조회
  async findAll() {
    const cards = await this.cardRepository.find({
      select: ['id', 'listId', 'title', 'content', 'color', 'deadline'],
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

  async remove(id: number) {
    // 카드를 가지고 있는지 여부 검사
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('카드를 찾을 수 없습니다.');
    await this.cardRepository.delete({
      id: id,
    });
    return card;
  }
}
