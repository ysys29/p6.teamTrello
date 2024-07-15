import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SendEmailDto {
  /**
   * 이메일
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: `이메일을 입력해 주세요.` })
  @IsEmail({}, { message: `이메일 형식에 맞지 않습니다.` })
  email: string;

  /**
   * BoardId
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  boardId?: number;
}
