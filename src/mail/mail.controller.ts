import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send-email-test')
  async sendEmail(@Body('email') email: string) {
    const data = await this.mailService.sendMail({ email });

    return {
      statusCode: HttpStatus.CREATED,
      message: `${email}에 인증 토큰을 보냈습니다.`,
      data: data,
    };
  }
}
