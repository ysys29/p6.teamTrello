import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SearchUserParamsDto {
  @Transform(({ value }) => Number(value)) // 추가
  @IsNumber()
  userId: number;
}
