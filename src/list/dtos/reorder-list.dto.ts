import { IsOptional } from 'class-validator';

export class ReorderListDto {
  /**
   * @example 1
   */
  @IsOptional()
  beforeId?: number;

  /**
   * @example 2
   */
  @IsOptional()
  afterId?: number;
}
