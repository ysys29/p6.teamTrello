import { IsOptional } from 'class-validator';

export class ReorderCardDto {
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

  /**
   * @example 1
   */
  @IsOptional()
  ListId?: number;
}
