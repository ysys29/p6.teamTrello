import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ListIdDto {
  /**
   * 리스트 id
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  listId: number;
}
