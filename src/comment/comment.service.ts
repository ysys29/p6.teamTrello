import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { SearchCommentDto } from './dto/search-comment.dto';

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

  async findMany(cardId: number) {
    const data = await this.commentRepository.find({ where: { cardId: cardId }, select: ['cardId', 'comment'] });
    return data;
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    //해당하는 카드 찾기 : 입력카드 번호와 카드번호가 일치한지
    const { cardId } = updateCommentDto;
    const card = await this.cardRepository.findOneBy({ id: cardId });
    if (!card) {
      throw new NotFoundException('해당하는 카드가 없습니다.');
    }
    //입력받은 카드 아이디와 댓글을 조인해서 입력받은 댓글아이디 값이랑
    //해당하는 댓글 찾기 : 입력댓글
    const findComment = await this.commentRepository.findOneBy({ id });
    if (!findComment || cardId !== findComment.cardId) {
      throw new NotFoundException('해당하는 댓글이 없습니다.');
    } else if (userId !== findComment.userId) {
      throw new UnauthorizedException('해당 댓글에 접근 권한이 없습니다.');
    }

    //수정 ...updateCommentDto에 comment 포함되어 지움
    const updateComment = await this.commentRepository.save({ id, ...updateCommentDto });
    //반환
    return updateComment;
  }
  //삭제
  async remove(id: number, userId, SearchCommentDto) {
    //해당하는 카드 찾기 : 입력카드 번호와 카드 일치한지
    // 내가 작성한 댓글인지? 아니라면 삭제 안되게
    const { cardId } = SearchCommentDto;
    const isCardExist = await this.commentRepository.findOneBy({ id: cardId });
    console.log(isCardExist);
    if (!isCardExist) {
      throw new NotFoundException('해당하는 카드가 없습니다.');
    }
    const existedComment = await this.commentRepository.findOneBy({ id });
    console.log(existedComment);
    if (!existedComment || id !== existedComment.id) {
      throw new NotFoundException('해당하는 댓글이 없습니다.');
    } else if (userId !== existedComment.userId) {
      throw new UnauthorizedException('접근권한이 없습니다.');
    }
    await this.commentRepository.delete({ id });
    return;
  }
}
