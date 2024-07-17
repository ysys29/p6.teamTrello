import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Card } from './card.entity';
import { User } from 'src/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('card_members')
export class CardMember {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 유저 아이디
   * @example 1
   */
  @IsNotEmpty({ message: `cardId 입력해주세요` })
  @Column()
  cardId: number;

  /**
   * 유저 아이디
   * @example 1
   */
  @IsNotEmpty({ message: `userId 입력해주세요` })
  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Card, (card) => card.cardMembers, { onDelete: 'CASCADE' })
  card: Card;

  @ManyToOne(() => User, (user) => user.cardMembers)
  user: User;
}
