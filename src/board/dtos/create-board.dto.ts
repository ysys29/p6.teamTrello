import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty({ message: '타이틀을 입력해 주세요.' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsHexColor({ message: '올바른 색상 코드를 입력해 주세오' })
  color?: string;

  @IsNotEmpty({ message: '보드 생성자 아이디를 입력해 주세요.' })
  ownerId: number;
}
