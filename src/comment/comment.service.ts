import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { cardId, comment } = createCommentDto;
    //필요한 것 : 카드아이디
    const card = await this.cardRepository.findOneBy({ id: cardId });
    if (!card) {
      throw new NotFoundException('해당하는 카드가 없습니다.');
    }

    const newComment = await this.commentRepository.save({
      userId,
      cardId,
      comment,
    });

    return newComment;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
