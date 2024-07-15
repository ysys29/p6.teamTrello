import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['boardId', 'lexoRank'])
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardId: number;

  @Column()
  title: string;

  @Column()
  lexoRank: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Board, (board) => board.lists)
  board: Board;

  @OneToMany((type) => Card, (card) => card.list)
  cards: Card[];
}
