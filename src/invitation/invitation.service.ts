import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardInvitation } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { User } from 'src/user/entities/user.entity';
import { InvitationStatus } from './types/invitation-status.type';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(BoardInvitation)
    private readonly boardInvitationRepository: Repository<BoardInvitation>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepostitory: Repository<BoardMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 초대 보내기
  async sendInvitation(userId: number, sendInvitationDto: SendInvitationDto) {
    const { boardId, email } = sendInvitationDto;

    const isAvailableMember = await this.boardMemberRepostitory.findOne({
      where: { boardId, userId },
    });

    if (!isAvailableMember) {
      throw new UnauthorizedException('초대 권한이 없습니다.');
    }

    // 해당 이메일의 유저가 존재하는지 찾기
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('해당하는 이메일의 유저가 존재하지 않습니다.');
    }

    // 이미 보드에 존재하는 멤버면 에러
    const existingUser = await this.boardMemberRepostitory.findOne({
      where: { boardId, userId: user.id },
    });

    if (existingUser) {
      throw new ConflictException('이미 보드에 존재하는 멤버입니다.');
    }

    // 이미 초대해서, invited 상태인 유저면 에러
    const existingInvitation = await this.boardInvitationRepository.findOne({
      where: { boardId, email, status: InvitationStatus.INVITED },
    });

    if (existingInvitation) {
      throw new ConflictException('이미 초대한 멤버입니다. 수락을 기다려 주세요.');
    }

    // 초대 저장하기
    await this.boardInvitationRepository.save({ boardId, email });

    return true;
  }

  // 내 초대 목록 조회하기
  async getReceivedInvitations(userId: number) {
    // 받은 아이디로 유저의 이메일 찾기
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }

    const invitations = await this.boardInvitationRepository.find({
      where: { email: user.email },
    });

    return invitations;
  }
}
