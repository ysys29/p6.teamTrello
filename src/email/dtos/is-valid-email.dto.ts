import { PickType } from '@nestjs/swagger';
import { SaveEmailDto } from './save-email.dto';

export class IsValidEmailDto extends PickType(SaveEmailDto, ['email']) {}
