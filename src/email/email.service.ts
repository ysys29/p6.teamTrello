import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import nodeMailer from 'nodemailer';
import { SendEmailDto } from './dtos/send-email.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveEmailDto } from './dtos/save-email.dto';

@Injectable()
export class EmailService {
  private readonly nodeMailerId: string;
  private readonly nodeMailerPass: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {
    this.nodeMailerId = this.configService.get<string>('NODE_MAILER_ID');
    this.nodeMailerPass = this.configService.get<string>('NODE_MAILER_PASSWORD');
  }

  // return 값 지우고, async await 빼기 = response는 보내고, 실제로 서버 뒤에서 처리하고 있어도 됨
  // 메일 보내기
  async sendEmail({ email, boardId }: SendEmailDto) {
    // 토큰 만들기
    const token = this.makeToken({ email, boardId }).token;

    this.saveEmail({ email, token });

    // 메일 보내는 세팅 / 나중에 분리하자 1.
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      port: 465,
      host: 'smtp.gmail.com',
      secure: true,
      requireTLS: true,
      auth: {
        user: this.nodeMailerId,
        pass: this.nodeMailerPass,
      },
    });

    // 메일 형식 / 나중에 분리하자 2
    const mailOptions: nodeMailer.SendMailOptions = {
      from: 'p6-trello-project@gmail.com',
      to: email,
      subject: '[p6-Trello] 회원가입 인증 메일입니다.',
      html: `
      <h2 style="margin: 20px 0">[p6-Trello] 이메일 인증 토큰을 입력해 주세요.</h2>
      <p>인증 유효시간은 5분 입니다.</p>
      <p>
      <div id="token">${token}</div>
      <button
        onclick="copyT()"
        style="background-color: #c0c0c0; color: #000000; width: 80px; height: 40px; border-radius: 5px; border: none">
        복사하기
      </button>
      </p>

      <script>
        function copyT() {
          var obj = document.getElementById('token');
          var range = document.createRange();
          range.selectNode(obj.childNodes[0]); 
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand('copy');
          sel.removeRange(range);
          alert('복사되었습니다 :)');
        }
      </script>
      </form>`,
    };

    await transporter.sendMail(mailOptions);

    return token;
  }

  // 메일 보낸 기록 저장하기
  saveEmail(saveEmailDto: SaveEmailDto) {
    this.emailRepository.save(saveEmailDto);
  }

  // 토큰 만들기
  makeToken({ email, boardId }: SendEmailDto): { token: string } {
    // boardId 존재하지 않으면 0
    const invitingBoardId = boardId ? boardId : 0;

    const payload = { email: email, boardId: invitingBoardId };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  // 메일 보낸 기록 검색하기
  async findEmail({ email }: { email: string }) {
    const isExistedEmail = await this.emailRepository.findOne({
      where: { email },
    });
    if (!isExistedEmail) {
      throw new BadRequestException('이메일 인증을 보낸 기록이 없습니다.');
    }

    return isExistedEmail;
  }
}
