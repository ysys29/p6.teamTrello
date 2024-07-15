import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ListIdDto {
  @IsNumber()
  @Type(() => Number)
  listId: number;
}
