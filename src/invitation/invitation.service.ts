import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardInvitation } from './entities/invitation.entity';
import { DataSource, Repository } from 'typeorm';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { User } from 'src/user/entities/user.entity';
import { InvitationStatus } from './types/invitation-status.type';
import { UpdateInvitationStatusDto } from './dtos/update-invitation-status.dto';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(BoardInvitation)
    private readonly boardInvitationRepository: Repository<BoardInvitation>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepostitory: Repository<BoardMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
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

  // 내가 받은 초대의 상태 변경
  async changeInvitationStatus(userId: number, invitationId: number, updateStatusDto: UpdateInvitationStatusDto) {
    const { status } = updateStatusDto;

    if (status === InvitationStatus.INVITED) {
      throw new BadRequestException('유효하지 않은 변경 상태입니다.');
    }

    const invitation = await this.boardInvitationRepository.findOneBy({ id: invitationId });

    if (!invitation) {
      throw new NotFoundException('해당 아이디의 초대를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user || invitation.email !== user.email) {
      throw new ForbiddenException('해당 초대의 상태 변경에 대한 권한이 없습니다.');
    }

    if (invitation.status !== InvitationStatus.INVITED) {
      throw new BadRequestException('상태가 Invited인 초대만 상태 수정할 수 있습니다.');
    }

    //여기부터 트랜잭션
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 상태 변경해서 저장
      invitation.status = status;
      await queryRunner.manager.save(BoardInvitation, invitation);

      if (status === InvitationStatus.ACCEPTED) {
        // 보드 멤버에 해당 유저 추가
        const boardMember = this.boardMemberRepostitory.create({ boardId: invitation.boardId, userId });
        await queryRunner.manager.save(BoardMember, boardMember);
      }

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('트랜잭션 오류');
    } finally {
      await queryRunner.release();
    }
  }
}
