import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '@nestjs/passport';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { UpdateInvitationStatusDto } from './dtos/update-invitation-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('보드 멤버 초대')
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  /**
   * 초대 보내기
   * @param sendInvitationDto
   * @returns
   */
  // 초대 보내기(보드 멤버 모두가 초대를 보낼 수 있음)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendInvitation(@Request() user, @Body() sendInvitationDto: SendInvitationDto) {
    return await this.invitationService.sendInvitation(user.id, sendInvitationDto);
  }

  /**
   * 내가 받은 초대 목록 조회
   * @param req
   * @returns
   */
  // 내가 받은 초대 목록 조회
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getReceivedInvitations(@Request() user) {
    return this.invitationService.getReceivedInvitations(user.id);
  }

  /**
   * 내가 받은 초대 상태 변경
   * @param invitationId
   * @param updateStatusDto
   * @returns
   */
  // 내가 받은 초대의 상태 변경하기
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':invitationId')
  async changeInvitationStatus(
    @Request() user,
    @Param('invitationId') invitationId: number,
    @Body() updateStatusDto: UpdateInvitationStatusDto,
  ) {
    return this.invitationService.changeInvitationStatus(user.id, invitationId, updateStatusDto);
  }
}
