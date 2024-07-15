import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
export class SearchCardMemeberParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cardId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  userId: number;
}
