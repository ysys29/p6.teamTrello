import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateBoardDto {
  /**
   * 제목
   * @example "title?"
   */
  @IsNotEmpty({ message: '타이틀을 입력해 주세요.' })
  @IsString()
  title: string;

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
