import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Email } from 'src/email/entities/email.entity';
import { EmailService } from 'src/email/email.service';
import { InvitationModule } from 'src/invitation/invitation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Email]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
    InvitationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
