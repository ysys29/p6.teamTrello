import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 어디서 Jwt를 뺴올꺼냐? header에서 authorization에서 BearerToken을 쓴다.
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // 검증할 때, 이 코드를 쓰겠다.
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
