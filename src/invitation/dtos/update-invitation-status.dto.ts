import { IsEnum, IsNotEmpty } from 'class-validator';
import { InvitationStatus } from '../types/invitation-status.type';

export class UpdateInvitationStatusDto {
  @IsNotEmpty({ message: '변경할 상태를 입력해 주세요.' })
  @IsEnum(InvitationStatus, { message: '유효하지 않은 변경 상태입니다.' })
  status: InvitationStatus;
}
