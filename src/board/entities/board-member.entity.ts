import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('board_members')
export class BoardMembers {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  boardId: number;

  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
