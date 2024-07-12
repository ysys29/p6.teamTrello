import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '@nestjs/passport';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { UpdateInvitationStatusDto } from './dtos/update-invitation-status.dto';

@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  // 초대 보내기(보드 멤버 모두가 초대를 보낼 수 있음)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendInvitation(@Request() user, @Body() sendInvitationDto: SendInvitationDto) {
    return await this.invitationService.sendInvitation(user.id, sendInvitationDto);
  }

  // 내가 받은 초대 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getReceivedInvitations(@Request() req) {
    return this.invitationService.getReceivedInvitations(req.user.id);
  }

  // 내가 받은 초대의 상태 변경하기
  @UseGuards(AuthGuard('jwt'))
  @Patch(':invitationId')
  async changeInvitationStatus(
    @Request() req,
    @Param('invitationId') invitationId: number,
    @Body('status') updateStatusDto: UpdateInvitationStatusDto,
  ) {
    return this.invitationService.changeInvitationStatus(req.user.id, invitationId, updateStatusDto);
  }
}
