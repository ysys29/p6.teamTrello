import { PickType } from '@nestjs/swagger';
import { Email } from '../entities/email.entity';

export class SaveEmailDto extends PickType(Email, ['email', 'token']) {}
