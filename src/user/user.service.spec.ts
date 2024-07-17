import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type UserWithoutRelations = Omit<User, 'boards' | 'boardMembers' | 'cardMembers' | 'comments'>;

const mockRepository = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findOneById: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
});

const configService = {
  get: jest.fn(),
};

describe('UserService test', () => {
  let userService: UserService;
  let mockUserRepository: MockRepository<User>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    mockUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOneById', () => {
    it('사용자 ID와 일치하는 사용가 없을 때, status: 404, message: 사용자를 찾을 수 없습니다. ', async () => {
      // Give
      const userId = 1;
      const mockReturn = { message: '사용자를 찾을 수 없습니다.' };
      mockUserRepository.findOne.mockResolvedValue(null);

      // When
      await expect(userService.findOneById(userId)).rejects.toThrow(new NotFoundException(mockReturn.message));

      // Then
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['boardMembers'],
      });
    });
    it('사용자 ID와 일치하는 사용자가 존재할 때, 사용자 테이블과 "boardMembers" 관계만 정리해서 가져온다.', async () => {
      // Give
      const userId = 1;
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        nickname: 'test',
        imgUrl: 'testImgUrl',
        deletedAt: null,
        boardMembers: [
          {
            id: 1,
            boardId: 2,
          },
          {
            id: 2,
            boardId: 3,
          },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // When
      const result = await userService.findOneById(userId);

      // Then
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['boardMembers'],
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
        imgUrl: mockUser.imgUrl,
        deletedAt: mockUser.deletedAt,
        boardMembers: mockUser.boardMembers.map((boardMember) => ({
          id: boardMember.id,
          boardId: boardMember.boardId,
        })),
      });
    });
  });

  describe('update', () => {
    it('새 비밀번호와 새 비밀번호 확인이 서로 일치하지 않을 때, status:400, message: 새 비밀번호와 새 비밀번호 확인이 서로 일치하지 않습니다.', async () => {
      // Given
      const id = 1;
      const newPassword = 'Example2@';
      const newPasswordConfirm = 'Example2@123';
      const nickname = '재밌어요';
      const imgUrl = '나에게테스트코드는살인이다';
      const mockReturn = { message: '새 비밀번호와 새 비밀번호 확인이 서로 일치하지 않습니다.' };

      // When
      await expect(userService.update(id, { newPassword, newPasswordConfirm, nickname, imgUrl })).rejects.toThrow(
        new BadRequestException(mockReturn.message),
      );

      // Then
      expect(newPassword).not.toEqual(newPasswordConfirm);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(0);
    });
    it('내 정보 (비밀번호, 닉네임, imgUrl) 수정', async () => {
      // Given
      const id = 1;
      const newPassword = 'Example2@';
      const newPasswordConfirm = 'Example2@';
      const nickname = '재밌어요';
      const imgUrl = '나에게테스트코드는살인이다';
      const hashedNewPassword = 'hashedNewPassword';
      const hashRounds = 3;
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
      const mockUpdatedUser: UserWithoutRelations = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedNewPassword',
        nickname: nickname,
        imgUrl: imgUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockReturn = { ...mockUpdatedUser };
      delete mockReturn.password;

      jest.spyOn(bcrypt, 'hashSync').mockImplementation((newPassword: string, hashRounds: number) => hashedNewPassword);
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUpdatedUser);
      // When
      const result = await userService.update(id, { newPassword, newPasswordConfirm, nickname, imgUrl });

      // Then
      expect(newPassword).toEqual(newPasswordConfirm);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockReturn);
    });
  });

  describe('softDelete', () => {
    // it('사용자 ID와 일치하는 사용자가 없을 때, status: 404, message: 사용자를 찾을 수 없습니다.', async () => {
    //   // Given
    //   const id = 1;
    //   const mockReturn = { message: '사용자를 찾을 수 없습니다.' };
    //   mockUserRepository.findOne.mockResolvedValue(null);
    //   // When
    //   await expect(userService.softDelete(id)).rejects.toThrow(new NotFoundException(mockReturn.message));
    //   // Then
    //   expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    //   expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    //   expect(mockUserRepository.softDelete).toHaveBeenCalledTimes(0);
    // });
    // it('사용자 ID와 일치하는 사용자가 존재할 때, softDelete로 회원 탈퇴에 성공', async () => {
    //   // Given
    //   const id = 1;
    //   const mockUser: UserWithoutRelations = {
    //     id: 1,
    //     email: 'test@test.com',
    //     password: 'password',
    //     nickname: 'test',
    //     imgUrl: 'testImgUrl',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     deletedAt: null,
    //   };
    //   mockUserRepository.findOne.mockResolvedValue(mockUser);
    //   // When
    //   await userService.softDelete(id);
    //   // Then
    //   expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    //   expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    //   expect(mockUserRepository.softDelete).toHaveBeenCalledTimes(1);
    //   expect(mockUserRepository.softDelete).toHaveBeenCalledWith({ id });
    // });
  });
});
