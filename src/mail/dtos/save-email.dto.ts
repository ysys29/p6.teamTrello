import { PickType } from '@nestjs/swagger';
import { Mail } from '../entities/mail.entity';

export class SaveMailDto extends PickType(Mail, ['email', 'token']) {}
