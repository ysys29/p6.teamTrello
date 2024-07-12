import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['boardMembers'],
    });

    if (!user || user.deletedAt !== null) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // 사용자

    return `This action updates a #${id} user`;
  }

  // 회원 탈퇴하기
  async softDelete(id: number) {
    const user = await this.findOneById(id);

    await this.userRepository.softDelete({ id });
  }
}
