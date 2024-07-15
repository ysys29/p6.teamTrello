import { IsString, IsHexColor, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty({ message: `리스트 아이디를 입력해주세요` })
  @IsNumber()
  listId: number;

  @IsNotEmpty({ message: `제목을 입력해주세요` })
  @IsString()
  title: string;

  @IsNotEmpty({ message: `내용을 입력해주세요` })
  @IsString()
  content: string;

  @IsNotEmpty({ message: `색상 코드를 입력해주세요` })
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세요' })
  color: string;
}
