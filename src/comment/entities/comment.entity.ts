import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardId: number;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne((type) => Card, (card) => card.comments)
  card: Card;

  @ManyToOne((type) => User, (user) => user.comments)
  user: User;
}
