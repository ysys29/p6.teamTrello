import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardMember } from './board-member.entity';
import { BoardInvitation } from './board-invitation.entity';
import { List } from 'src/list/entities/list.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @IsNotEmpty({ message: '보드 이름을 입력해 주세요.' })
  @IsString()
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.boards)
  @JoinColumn({ name: 'owner_id' })
  user: User;

  @OneToMany((type) => BoardMember, (boardMember) => boardMember.board)
  boardMembers: BoardMember[];

  @OneToMany((type) => BoardInvitation, (boardInvitation) => boardInvitation.board)
  boardInvitations: BoardInvitation[];

  @OneToMany((type) => List, (list) => list.board)
  lists: List[];
}
