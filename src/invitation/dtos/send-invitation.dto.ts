import { IsNotEmpty } from 'class-validator';

export class SendInvitationDto {
  @IsNotEmpty()
  boardId: number;

  @IsNotEmpty()
  email: string;
}
