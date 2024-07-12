import { IsEnum, ValidateIf } from 'class-validator';
import { InvitationStatus } from '../types/invitation-status.type';

export class UpdateInvitationStatusDto {
  @ValidateIf((_) => _.status !== InvitationStatus.INVITED)
  @IsEnum(InvitationStatus, { message: '입력 가능한 스테이터스는 ACCEPTED와 DECLINED입니다.' })
  status: InvitationStatus;
}
