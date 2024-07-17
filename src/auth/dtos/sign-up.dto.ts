import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column } from 'typeorm';

export class SignUpDto extends PickType(User, ['email', 'password', 'nickname', 'imgUrl']) {
  /**
   * 비밀번호 확인
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호 확인을 입력해 주세요.' })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  passwordConfirm: string;

  /**
   * 토큰
   * @example "token"
   */
  @IsNotEmpty({ message: `토큰을 입력해 주세요.` })
  @IsString({ message: `토큰 형식에 맞지 않습니다.` })
  @Column()
  token: string;
}
