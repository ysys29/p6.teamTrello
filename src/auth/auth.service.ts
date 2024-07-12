import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dtos/sign-in.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 회원가입
  async signUp({ email, password, passwordConfirm, nickname, imgUrl }) {
    // 비밀번호와 비밀번호 확인이랑 일치하는 지
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.');
    }

    // 해당 email로 가입한 사용자가 없는 지
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException(`이미 가입 된 이메일 입니다.`);
    }

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      nickname,
      imgUrl,
    });

    delete user.password;

    return this.signIn(user.id);
  }

  // 로그인
  signIn(userId: number): { accessToken: string } {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // 일단 아이디만 넘기는 중
  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    const isPasswordMatched = bcrypt.compareSync(password, user?.password ?? '');

    if (!user || !isPasswordMatched) {
      return null;
    }

    return { id: user.id };
  }
}
