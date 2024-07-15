import { IsNotEmpty, IsNumber } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  /**
   * 카드 아이디
   * @example "1"
   */
  @IsNumber()
  @IsNotEmpty({ message: '댓글 작성할 카드Id를 입력해주세요.' })
  @Column({ unsigned: true })
  cardId: number;

  @IsNumber()
  @Column()
  userId: number;

  /**
   * 내용
   * @example "내용내용"
   */
  @IsNotEmpty({ message: '댓글을 입력해주세요' })
  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;
}
