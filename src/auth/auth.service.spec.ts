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
import { BadRequestException } from '@nestjs/common';

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

const mockEmailService = {
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
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EmailService, useValue: mockEmailService },
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
    it('비밀번호와 비밀번호 확인이 일치하지 않을 때, BadRequestException 발생', async () => {
      // Given
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        token: 'token.token.token',
        password: 'password1',
        passwordConfirm: 'password2',
        nickname: 'nickname',
        imgUrl: 'imgUrl',
      };

      // When Then
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.'),
      );
    });

    it('이미 가입된 이메일일 경우, BadRequestException 발생', async () => {
      // Given
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        token: 'token.token.token',
        password: 'Password1!',
        passwordConfirm: 'Password1!',
        nickname: 'nickname',
        imgUrl: 'imgUrl',
      };

      mockUserRepository.findOne.mockResolvedValue({ email: signUpDto.email });

      // When Then
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('이미 가입 된 이메일 입니다.'),
      );
    });

    it('인증 이메일을 발송한 기록이 없을 경우, BadRequestException 발생', async () => {
      // Given
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        token: 'token.token.token',
        password: 'Password1!',
        passwordConfirm: 'Password1!',
        nickname: 'nickname',
        imgUrl: 'imgUrl',
      };

      mockEmailService.findEmail.mockResolvedValue(null);

      // When & Then
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('인증 이메일을 발송한 기록이 없습니다.'),
      );
    });

    it('보드 ID가 없는 경우 회원가입 성공', async () => {
      // Given
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        token: 'token.token.token',
        password: 'Password1!',
        passwordConfirm: 'Password1!',
        nickname: 'nickname',
        imgUrl: 'imgUrl',
      };

      mockEmailService.findEmail.mockResolvedValue(signUpDto);

      const decodedToken = { payload: { email: signUpDto.email, boardId: 0 } };
      mockJwtService.decode.mockReturnValue(decodedToken);

      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      mockUserRepository.save.mockResolvedValue({ ...signUpDto, id: 1, password: hashedPassword });
      const mockReturn = { accessToken: 'accessToken' };

      // When
      const result = await authService.signUp(signUpDto);

      // Then
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: signUpDto.email,
        password: hashedPassword,
        nickname: signUpDto.nickname,
        imgUrl: signUpDto.imgUrl,
      });
      expect(invitationService.changeInvitationStatus).toHaveBeenCalledTimes(0);
      expect(result).toEqual(mockReturn);
    });

    it('보드 ID가 있는 경우 회원가입 성공 후 보드 초대 수락', async () => {
      // Given
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        token: 'token.token.token',
        password: 'password',
        passwordConfirm: 'password',
        nickname: 'nickname',
        imgUrl: 'imgUrl',
      };

      mockEmailService.findEmail.mockResolvedValue(signUpDto.email);

      const decodedToken = { payload: { email: signUpDto.email, boardId: 1 } };
      mockJwtService.decode.mockReturnValue(decodedToken);

      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const user = { ...signUpDto, id: 1, password: hashedPassword };
      mockUserRepository.save.mockResolvedValue(user);

      invitationService.getReceivedInvitations.mockResolvedValue([{ id: 1 }]);
      const mockReturn = { accessToken: 'accessToken' };
      // When
      const result = await authService.signUp(signUpDto);

      // Then
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: signUpDto.email,
        password: hashedPassword,
        nickname: signUpDto.nickname,
        imgUrl: signUpDto.imgUrl,
      });
      expect(invitationService.changeInvitationStatus).toHaveBeenCalledTimes(1);
      expect(invitationService.changeInvitationStatus).toHaveBeenCalledWith(user.id, 1, {
        status: 'ACCEPTED',
      });
      expect(result).toEqual(mockReturn);
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
