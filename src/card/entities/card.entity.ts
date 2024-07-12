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
} from 'typeorm';
import { CardMember } from './card-member.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  color: string;

  @Column()
  lexoRank: string;

  @Column()
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => List, (list) => list.cards)
  list: List;

  @OneToMany((type) => CardMember, (cardmember) => cardmember.card)
  cardMembers: CardMember[];

  @OneToMany((type) => Comment, (comment) => comment.card)
  comments: Comment[];
}
