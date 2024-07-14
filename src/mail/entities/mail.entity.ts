import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mails')
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   *
   */
  @IsNotEmpty({ message: `이메일을 입력해 주세요.` })
  @IsEmail({}, { message: `이메일 형식에 맞지 않습니다.` })
  @Column() // @Column({ unique: true })
  email: string;

  @IsNotEmpty({ message: `토큰을 입력해 주세요.` })
  @IsString({ message: `토큰 형식에 맞지 않습니다.` })
  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
