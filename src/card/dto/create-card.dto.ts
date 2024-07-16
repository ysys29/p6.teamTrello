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
   * @example 튜터님께 여쭤보기
   * 제목
   * @example "title?"
   */
  @IsNotEmpty({ message: `제목을 입력해주세요` })
  @IsString()
  title: string;

  /**
   * @example 뭐라고 여쭤보지
   * 설명
   * @example "description?"
   */
  @IsNotEmpty({ message: `내용을 입력해주세요` })
  @IsString()
  content: string;

  /**
   * @example #ffffff
   * 색상
   * @example "#FFFFFF"
   */
  @IsNotEmpty({ message: `색상 코드를 입력해주세요` })
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세요' })
  color: string;
}
