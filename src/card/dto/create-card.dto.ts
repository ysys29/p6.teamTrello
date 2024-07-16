import { IsString, IsHexColor, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  /**
   * @example 1
   */
  @IsNotEmpty({ message: `리스트 아이디를 입력해주세요` })
  @IsNumber()
  listId: number;

  /**
   * @example 튜터님께 여쭤보기
   */
  @IsNotEmpty({ message: `제목을 입력해주세요` })
  @IsString()
  title: string;

  /**
   * @example 뭐라고 여쭤보지
   */
  @IsNotEmpty({ message: `내용을 입력해주세요` })
  @IsString()
  content: string;

  /**
   * @example #ffffff
   */
  @IsNotEmpty({ message: `색상 코드를 입력해주세요` })
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세요' })
  color: string;
}
