import { IsOptional, IsString, IsHexColor } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional({ message: '타이틀을 입력해 주세요.' })
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color?: string;
}
