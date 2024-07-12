import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Card } from './card.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('card_members')
export class CardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Card, (card) => card.cardMembers)
  card: Card;

  @ManyToOne((type) => User, (user) => user.cardMembers)
  user: User;
}
