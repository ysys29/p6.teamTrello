import { IsOptional, IsString, IsHexColor, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateCardDto {
  /**
   * @example 튜터님께 여쭤보기
   */
  @IsOptional({ message: '타이틀을 입력해 주세요.' })
  @IsString()
  title?: string;

  /**
   * @example 뭐라고 여쭤보지
   */
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * @example #ffffff
   */
  @IsOptional()
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color?: string;

  /**
   * 마감일
   * @example "2024-07-16T11:35:17.550Z"
   */
  @IsOptional()
  @IsDate({ message: '날짜 형식에 맞춰서 입력해 주세요' })
  @Type(() => Date)
  deadline?: Date;
}
