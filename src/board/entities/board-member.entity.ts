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
import { Board } from './board.entity';

@Entity('board_members')
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
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne((type) => Board, (board) => board.boardMembers)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
