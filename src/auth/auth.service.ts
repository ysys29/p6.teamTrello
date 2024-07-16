import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dtos/sign-in.dto';
import bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { InvitationService } from 'src/invitation/invitation.service';
import { InvitationStatus } from 'src/invitation/types/invitation-status.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly invitationService: InvitationService,
  ) {}

  // 회원가입
  async signUp({ email, token, password, passwordConfirm, nickname, imgUrl }: SignUpDto) {
    // 비밀번호와 비밀번호 확인이랑 일치하는 지
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.');
    }

    // 해당 email로 가입한 사용자가 없는 지 withDeleted로 soft delete한 사용자도 찾기. (기본적으로 안 찾음)
    const existedUser = await this.userRepository.findOne({ where: { email }, withDeleted: true });
    if (existedUser) {
      throw new BadRequestException(`이미 가입 된 이메일 입니다.`);
    }

    // 해당 email로 인증 메일을 보낸 적이 있는 지 확인.
    const existedEmail = await this.emailService.findEmailByToken({ token });
    if (!existedEmail) {
      throw new BadRequestException('인증 이메일을 발송한 기록이 없습니다.');
    }

    // 인증 번호에 초대 받았는 지 그냥 가입한 건 지 체크.
    const decodedToken = this.jwtService.decode(token, { complete: true });
    const boardId = decodedToken.payload.boardId;

    // 비밀번호 뭉개기
    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      nickname,
      imgUrl,
    });

    delete user.password;

    console.log('🚀 ~ AuthService ~ signUp ~ boardId:', boardId);
    console.log('🚀 ~ AuthService ~ signUp ~ user:', user);

    if (boardId !== 0) {
      // 보드 아이디 가지고 보드 초대 상태 변경하는 API 실행
      const invitations = await this.invitationService.getReceivedInvitations(user.id);

      // 찾아보고 있으면 상태도 변경해주고 아니면 넘어가기.
      if (invitations && invitations.length > 0) {
        await this.invitationService.changeInvitationStatus(user.id, invitations[0].id, {
          status: InvitationStatus.ACCEPTED,
        });
      }
    }

    return this.signIn(user.id);
  }

  // 로그인
  signIn(userId: number): { accessToken: string } {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // deletedAt도 넘김
  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true, deletedAt: true },
    });

    const isPasswordMatched = bcrypt.compareSync(password, user?.password ?? '');

    if (!user || !isPasswordMatched) {
      return null;
    }

    return { id: user.id };
  }
}
