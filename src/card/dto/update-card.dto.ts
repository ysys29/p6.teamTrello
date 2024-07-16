import { IsOptional, IsString, IsHexColor, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateCardDto {
  @IsOptional()
  @IsNumber()
  listId?: number;

  @IsOptional({ message: '타이틀을 입력해 주세요.' })
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color?: string;

  @IsOptional()
  @IsDate({ message: '날짜 형식에 맞춰서 입력해 주세요' })
  @Type(() => Date)
  deadline?: Date;
}
