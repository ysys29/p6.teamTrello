import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '@nestjs/passport';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { UpdateInvitationStatusDto } from './dtos/update-invitation-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvitationIdDto } from './dtos/invitation-id.dto';

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
  async sendInvitation(@Request() req, @Body() sendInvitationDto: SendInvitationDto) {
    const data = await this.invitationService.sendInvitation(req.user.id, sendInvitationDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '초대를 성공적으로 전송했습니다.',
      data,
    };
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
  async getReceivedInvitations(@Request() req) {
    const data = await this.invitationService.getReceivedInvitations(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: '내가 받은 초대 목록',
      data,
    };
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
    @Request() req,
    @Param() invitationIdDto: InvitationIdDto,
    @Body() updateStatusDto: UpdateInvitationStatusDto,
  ) {
    const data = await this.invitationService.changeInvitationStatus(
      req.user.id,
      invitationIdDto.invitationId,
      updateStatusDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: `${invitationIdDto.invitationId}번 초대의 상태를 변경했습니다`,
      data,
    };
  }
}
