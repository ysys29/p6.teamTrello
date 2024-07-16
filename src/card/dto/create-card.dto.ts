import { IsString, IsHexColor, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  /**
   * 리스트 ID
   * @example 1
   */
  @IsNotEmpty({ message: `리스트 아이디를 입력해주세요` })
  @IsNumber()
  listId: number;

  /**
   * 제목
   * @example "title?"
   */
  @IsNotEmpty({ message: `제목을 입력해주세요` })
  @IsString()
  title: string;

  /**
   * 설명
   * @example "description?"
   */
  @IsNotEmpty({ message: `내용을 입력해주세요` })
  @IsString()
  content: string;

  /**
   * 색상
   * @example "#FFFFFF"
   */
  @IsNotEmpty({ message: `색상 코드를 입력해주세요` })
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세요' })
  color: string;
}
