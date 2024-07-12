import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // 기본적으로 username과 password라는 이름을 가져오게 설정되있는데 우리 입맛에 맞게 수정해야함.
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<{ id: number }> {
    const user = await this.authService.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException('일치하는 인증 정보가 없습니다.');
    }

    return user;
  }
}
