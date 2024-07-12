import { Controller, Get, Request, UseGuards, HttpStatus, Delete, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('/:id')
  // findOneById(@Param('id') id: string) {
  //   return this.userService.findOneById(+id);
  // }

  /**
   * 내 정보 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findOne(@Request() req) {
    const data = await this.userService.findOneById(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: `내 정보 조회에 성공했습니다.`,
      data,
    };
  }

  /**
   * 내 정보 수정
   * @param req
   * @param updateUserDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const data = this.userService.update(req.user.id, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: `내 정보 수정에 성공했습니다.`,
      data,
    };
  }

  /**
   * 회원 탈퇴
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me')
  async remove(@Request() req) {
    this.userService.softDelete(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: `회원 탈퇴에 성공했습니다.`,
    };
  }
}
