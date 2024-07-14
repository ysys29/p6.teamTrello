import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity('board_members')
@Unique(['boardId', 'userId'])
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.boardMembers)
  user: User;

  @ManyToOne((type) => Board, (board) => board.boardMembers)
  board: Board;
}
