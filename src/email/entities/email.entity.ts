import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 이메일
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: `이메일을 입력해 주세요.` })
  @IsEmail({}, { message: `이메일 형식에 맞지 않습니다.` })
  @Column()
  email: string;

  /**
   * 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTcyMDg4MDI3MSwiZXhwIjoxNzIwODgzODcxfQ.tw20otHG7sqvCPWfRAyLEhzL7Jdf5MBzgxP4hY12reM"
   */
  @IsNotEmpty({ message: `토큰을 입력해 주세요.` })
  @IsString({ message: `토큰 형식에 맞지 않습니다.` })
  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
