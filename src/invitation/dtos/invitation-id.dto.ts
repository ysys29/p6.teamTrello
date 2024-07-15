import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class InvitationIdDto {
  /**
   * 초대 id
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  invitationId: number;
}
