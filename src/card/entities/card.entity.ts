import { List } from 'src/list/entities/list.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { CardMember } from './card-member.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { IsHexColor, IsNotEmpty } from 'class-validator';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 리스트 아이디
   * @example "1"
   */
  @IsNotEmpty({ message: `listId 입력해주세요` })
  @Column()
  listId: number;

  /**
   * 제목
   * @example "튜터님께 피드백 받기"
   */
  @IsNotEmpty({ message: `title을 입력해주세요` })
  @Column()
  title: string;

  /**
   * 내용
   * @example "어떤 방법이 좋은지 여쭤보기"
   */
  @IsNotEmpty({ message: `content 입력해주세요` })
  @Column({ type: 'text' })
  content: string;

  /**
   * 색
   * @example "#ffffff"
   */
  @IsNotEmpty({ message: `color 입력해주세요` })
  @IsHexColor()
  @Column()
  color: string;

  @Column()
  lexoRank: string;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => List, (list) => list.cards)
  @JoinColumn({ name: 'listId' })
  list: List;

  @OneToMany(() => CardMember, (cardmember) => cardmember.card)
  cardMembers: CardMember[];

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}
