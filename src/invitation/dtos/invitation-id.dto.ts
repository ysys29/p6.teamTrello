import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class InvitationIdDto {
  @IsNumber()
  @Type(() => Number)
  invitationId: number;
}
