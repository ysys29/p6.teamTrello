import { PickType } from '@nestjs/swagger';
import { CardMember } from '../entities/card-member.entity';

export class CreateCardMemberDto extends PickType(CardMember, ['userId']) {}
