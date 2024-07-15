import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['boardMembers'],
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const response = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      imgUrl: user.imgUrl,
      deletedAt: user.deletedAt,
      boardMembers: user.boardMembers.map((boardMember) => ({
        id: boardMember.id,
        boardId: boardMember.boardId,
      })),
    };

    return response;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { newPassword, newPasswordConfirm, nickname, imgUrl } = updateUserDto;
    // 새 비밀번호와 새 비밀번호 확인이 맞는 지 확인
    const isNewPasswordMatched = newPassword === newPasswordConfirm;
    if (!isNewPasswordMatched) {
      throw new BadRequestException('새 비밀번호와 새 비밀번호 확인이 서로 일치하지 않습니다.');
    }

    const user = await this.userRepository.findOneBy({ id });

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(newPassword, hashRounds);

    user.password = newPassword ? hashedPassword : user.password;
    user.nickname = nickname ? nickname : user.nickname;
    user.imgUrl = imgUrl ? imgUrl : user.imgUrl;

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;

    return updatedUser;
  }

  // 회원 탈퇴하기
  async softDelete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.softDelete({ id });
  }
}
