import { IsOptional, IsString, IsHexColor } from 'class-validator';

export class UpdateBoardDto {
  /**
   * 제목
   * @example "title?"
   */
  @IsOptional({ message: '제목을 입력해 주세요.' })
  @IsString()
  title?: string;

  /**
   * 설명
   * @example "description?"
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * 색상
   * @example "#FFFFFF"
   */
  @IsOptional()
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color?: string;
}
