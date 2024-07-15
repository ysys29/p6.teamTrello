import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
export class SearchCardParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cardId: number;
}
