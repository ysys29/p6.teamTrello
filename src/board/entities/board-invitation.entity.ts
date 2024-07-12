import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { InvitationStatus } from '../types/invitation-status.type';
import { Board } from './board.entity';

@Entity('board_invitations')
export class BoardInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardId: number;

  @Column()
  userEmail: string;

  @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.INVITED })
  status: InvitationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Board, (board) => board.boardInvitations)
  board: Board;
}
