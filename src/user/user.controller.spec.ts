import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

const mockUserService = {
  findOneById: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('UserController test code', () => {
  let userController;
  let userService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // afterAll(async () => {
  //   jest.clearAllMocks();
  //   jest.resetAllMocks();
  //   jest.restoreAllMocks();
  // });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('내 정보 조회', async () => {
      // Given
      const userId = 1;
      const req = { user: { id: userId } };
      const mockUser = {
        id: userId,
        email: 'test@test.com',
        nickname: 'test',
        imgUrl: 'testImgUrl',
        deletedAt: null,
        boardMembers: [],
      };
      mockUserService.findOneById.mockResolvedValue(mockUser);

      // When
      const result = await userController.findOne(req);

      // Then
      expect(mockUserService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: '내 정보 조회에 성공했습니다.',
        data: mockUser,
      });
    });
  });

  describe('update', () => {
    it('updateUserDto이 없으면, status: 400, message:수정할 내용을 입력해 주세요.', async () => {
      // Given
      const req = { user: { id: 1 } };

      // When
      await expect(userController.update(req, null)).rejects.toThrow(
        new BadRequestException('수정할 내용을 입력해 주세요.'),
      );
      // Then
      expect(mockUserService.update).toHaveBeenCalledTimes(0);
    });
    it('새 비밀번호, 새 비밀번호 확인, 닉네임, 이미지를 입력하면, 성공하면 수정된 사용자 정보 반환.', async () => {
      // Given
      const userId = 1;
      const req = { user: { id: userId } };
      const updateUserDto: UpdateUserDto = {
        newPassword: 'Example2@',
        newPasswordConfirm: 'Example2@',
        nickname: '재밌어요',
        imgUrl: '나에게테스트코드는살인이다',
      };
      const updatedUser: User = {
        id: userId,
        email: 'test@test.com',
        password: null,
        nickname: '재밌어요',
        imgUrl: '나에게테스트코드는살인이다',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        boards: [],
        boardMembers: [],
        cardMembers: [],
        comments: [],
      };
      mockUserService.update.mockResolvedValue(updatedUser);

      // When
      const result = await userController.update(req, updateUserDto);

      // Then
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: '내 정보 수정에 성공했습니다.',
        data: updatedUser,
      });
    });
  });

  describe('remove', () => {
    it('회원 탈퇴', async () => {
      // Given
      const userId = 1;
      const req = { user: { id: userId } };
      mockUserService.softDelete.mockResolvedValue(undefined);

      // When
      const result = await userController.remove(req);

      // Then
      expect(mockUserService.softDelete).toHaveBeenCalledTimes(1);
      expect(mockUserService.softDelete).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: '회원 탈퇴에 성공했습니다.',
      });
    });
  });

  describe('findOneById', () => {
    it('사용자 ID를 입력 받으면 해당 사용자를 검색 후 반환', async () => {
      // Given
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'test@test.com',
        nickname: 'test',
        imgUrl: 'testImgUrl',
        deletedAt: null,
        boardMembers: [],
      };
      mockUserService.findOneById.mockResolvedValue(mockUser);

      // When
      const result = await userController.findOneById({ userId });

      // Then
      expect(mockUserService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: `'${mockUser.nickname}'님의 조회에 성공했습니다.`,
        data: mockUser,
      });
    });
  });
});
