import { IsString, IsHexColor, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty({ message: `colistIdlor 입력해주세요` })
  @IsNumber()
  listId: number;

  @IsNotEmpty({ message: `title 입력해주세요` })
  @IsString()
  title: string;

  @IsNotEmpty({ message: `content 입력해주세요` })
  @IsString()
  content: string;

  @IsNotEmpty({ message: `color 입력해주세요` })
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color: string;
}
