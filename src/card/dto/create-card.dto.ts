import { IsString, IsHexColor, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsNumber()
  listId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color: string;
}
