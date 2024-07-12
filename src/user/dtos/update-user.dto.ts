import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  /**
   * 기존 비밀번호
   * @example "Example1!"
   */
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  newPassword: string;
  /**
   * 새 비밀번호
   * @example "Example2!"
   */
  @IsNotEmpty({ message: '기존 비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  password: string;

  /**
   * 새 비밀번호 확인
   * @example "Example2!"
   */
  @ValidateIf((dto) => dto.newPassword !== undefined) // 새 비밀번호를 입력하지 않았을 경우
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  newPasswordConfirm: string;

  /**
   * 닉네임
   * @example "이강산mk2"
   */
  @IsOptional()
  @IsString()
  nickname?: string;

  /**
   * 이미지 URL
   * @example "https://i.namu.wiki/i/egdn5_REUgKuBUNPwkOg3inD6mLWMntHc-kXttvomkvaTMsWISF5sQqpHsfGJ8OUVqWRmV5xkUyRpD2U6g_oO03po08TisY6pAj5PXunSWaOHtGwrvXdHcL3p9_9-ZPryAadFZUE2rAxiK9vo5cv7w.svg"
   */
  @IsOptional()
  @IsString()
  imgUrl?: string;
}
