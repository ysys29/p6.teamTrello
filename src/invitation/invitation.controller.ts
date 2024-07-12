import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '@nestjs/passport';
import { SendInvitationDto } from './dtos/send-invitation.dto';

@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  // 초대 보내기(보드 멤버 모두가 초대를 보낼 수 있음)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendInvitation(@Request() user, @Body() sendInvitationDto: SendInvitationDto) {
    return await this.invitationService.sendInvitation(user.id, sendInvitationDto);
  }
}
