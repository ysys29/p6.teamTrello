import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';
import { IsValidEmailDto } from './dtos/is-valid-email.dto';

@ApiTags('이메일')
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * 인증 이메일 보내기
   * @param isValidEmailDto
   * @returns
   */
  @Post('/send')
  async sendEmail(@Body() isValidEmailDto: IsValidEmailDto) {
    const data = await this.emailService.sendEmail(isValidEmailDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: `${isValidEmailDto.email}에 인증 토큰을 보냈습니다.`,
      data: data,
    };
  }
}
