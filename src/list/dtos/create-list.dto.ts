import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  /**
   * 리스트를 생성할 보드 id
   * @example 1
   */
  @IsNotEmpty({ message: '리스트를 생성할 보드를 선택해 주세요.' })
  @IsNumber()
  boardId: number;

  /**
   * 리스트의 이름
   * @example "과제 흑흑"
   */
  @IsNotEmpty({ message: '생성할 리스트의 이름을 작성해 주세요' })
  @IsString()
  title: string;
}
