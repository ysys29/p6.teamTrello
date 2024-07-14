import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty({ message: `이메일을 입력해 주세요.` })
  @IsEmail({}, { message: `이메일 형식에 맞지 않습니다.` })
  email: string;

  @IsOptional()
  @IsNumber()
  boardId?: number;
}
