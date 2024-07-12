import { IsOptional } from 'class-validator';

export class ReorderListDto {
  @IsOptional()
  beforeId?: number;

  @IsOptional()
  afterId?: number;
}
