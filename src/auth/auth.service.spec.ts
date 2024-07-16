import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InvitationService } from 'src/invitation/invitation.service';
import { EmailService } from 'src/email/email.service';
import bcrypt from 'bcrypt';
import { SignUpDto } from './dtos/sign-up.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type UserWithoutRelations = Omit<User, 'boards' | 'boardMembers' | 'cardMembers' | 'comments'>;

const mockRepository = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  decode: jest.fn(),
};

const configService = {
  get: jest.fn(),
};

const emailService = {
  get: jest.fn(),
  findEmail: jest.fn(),
};

const invitationService = {
  getReceivedInvitations: jest.fn(),
  changeInvitationStatus: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EmailService, useValue: emailService },
        { provide: InvitationService, useValue: invitationService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('해당 email로 인증 메일을 보낸 적이 있는 지 확인하고, 없으면 status: 400, message: 인증 이메일을 발송한 기록이 없습니다.', async () => {
      // Given
      const email = 'test@test.com';
      const token = 'token.token.token';
      const password = 'password';
      const passwordConfirm = 'password';
      const nickname = 'nickname';
      const imgUrl = 'imgUrl';
      const hashRounds = 3;

      emailService.findEmail.mockResolvedValue({ email });
      // When
      const result = await authService.signUp({ email, token, password, passwordConfirm, nickname, imgUrl });

      // Then
    });
  });

  describe('signIn', () => {
    it('사용자 ID를 입력 받고, { accessToken: string }을 반환한다.', async () => {
      // Given
      const userId = 1;
      const payload = { id: userId };
      const accessToken = 'accessToken.accessToken.accessToken';
      mockJwtService.sign.mockReturnValue(accessToken);
      // When
      // mockJwtService.sign(payload)
      const result = authService.signIn(userId);

      // Then
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ accessToken });
    });
  });

  describe('validateUser', () => {
    it('이메일과 비밀번호를 입력 받고, 비밀번호랑 비교, 실패하면 null', async () => {
      // Given
      const email = 'test@test.com';
      const password = 'Password1!';
      const mockUser: UserWithoutRelations = {
        id: 1,
        email: 'test@test.com',
        password: 'password',
        nickname: 'test',
        imgUrl: 'testImgUrl',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockUserPassword: string = mockUser.password;
      const mockReturn = { id: 1 };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // When
      const isPasswordMatched = jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation((password: string, mockUserPassword: string) => false);
      const result = await authService.validateUser({ email, password });

      if (!mockUser || !isPasswordMatched) {
        return null;
      }

      // Then
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, password: true, deletedAt: true },
      });
      expect(result).toEqual(null);
    });
    it('이메일과 비밀번호를 입력 받고, 비밀번호랑 비교, 성공하면 { id:number }', async () => {
      // Given
      const email = 'test@test.com';
      const password = 'Password1!';
      const mockUser: UserWithoutRelations = {
        id: 1,
        email: 'test@test.com',
        password: 'password',
        nickname: 'test',
        imgUrl: 'testImgUrl',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockUserPassword: string = mockUser.password;
      const mockReturn = { id: 1 };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // When
      const isPasswordMatched = jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation((password: string, mockUserPassword: string) => true);
      const result = await authService.validateUser({ email, password });

      if (!mockUser || !isPasswordMatched) {
        return null;
      }

      // Then
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, password: true, deletedAt: true },
      });
      expect(result).toEqual(mockReturn);
    });
  });
});
