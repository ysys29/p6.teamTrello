import { PickType } from '@nestjs/swagger';
import { CardMember } from '../entities/card-member.entity';

export class CreateCardMeberDto extends PickType(CardMember, ['userId']) {}
