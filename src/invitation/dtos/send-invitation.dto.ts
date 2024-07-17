import { IsNotEmpty } from 'class-validator';

export class SendInvitationDto {
  /**
   * @example 1
   */
  @IsNotEmpty()
  boardId: number;

  /**
   * @example "test1@example.com"
   */
  @IsNotEmpty()
  email: string;
}
