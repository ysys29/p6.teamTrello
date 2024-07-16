import { IsOptional, IsString, IsHexColor, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateCardDto {
  /**
   * 리스트 ID
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  listId?: number;

  /**
   * 제목
   * @example "title?"
   */
  @IsOptional({ message: '제목을 입력해 주세요.' })
  @IsString()
  title?: string;

  /**
   * 내용
   * @example "content?"
   */
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * 색상
   * @example "#FFFFFF"
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
