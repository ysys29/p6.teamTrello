import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpStatus,
  Delete,
  Patch,
  Body,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SearchUserParamsDto } from './dtos/search-user.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내정보조회
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
   * 내정보수정
   * @param req
   * @param updateUserDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto) {
      throw new BadRequestException('수정할 내용을 입력해 주세요.');
    }

    const data = await this.userService.update(req.user.id, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: `내 정보 수정에 성공했습니다.`,
      data: data,
    };
  }

  /**
   * 회원탈퇴
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

  /**
   * 사용자조회
   * @param userId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async findOneById(@Param() searchUserParamsDto: SearchUserParamsDto) {
    const data = await this.userService.findOneById(searchUserParamsDto.userId);

    return {
      statusCode: HttpStatus.OK,
      message: `'${data.nickname}'님의 조회에 성공했습니다.`,
      data,
    };
  }
}
