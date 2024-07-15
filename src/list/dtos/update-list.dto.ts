import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateListDto {
  /**
   * @example "리스트1"
   */
  @IsNotEmpty({ message: '리스트의 이름을 입력해 주세요.' })
  @IsString()
  title: string;
}
