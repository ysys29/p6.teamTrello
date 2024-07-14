import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('보드')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('joined')
  async getUserBoards(@Request() req) {
    const userId = req.user.id;
    console.log('Controller - User ID:', userId);
    const data = await this.boardService.getUserBoards(Number(userId));
    console.log('Controller - Retrieved Boards:', data);
    return {
      statusCode: HttpStatus.OK,
      message: '사용자가 속한 보드 조회에 성공했습니다.',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    if (!createBoardDto) {
      throw new BadRequestException('보드 생성에 필요한 데이터를 입력해 주세요.');
    }

    const userId = req.user.id;
    const data = await this.boardService.create(createBoardDto, userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 생성에 성공했습니다.',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    const data = await this.boardService.findOne(id, userId);

    return {
      statusCode: HttpStatus.OK,
      message: '보드 조회에 성공했습니다.',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Request() req) {
    if (!updateBoardDto) {
      throw new BadRequestException('수정할 내용을 입력해 주세요.');
    }

    const userId = req.user.id;
    const data = await this.boardService.update(Number(id), updateBoardDto, userId);

    return {
      statusCode: HttpStatus.OK,
      message: '보드 수정에 성공했습니다.',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    await this.boardService.softDelete(Number(id), userId);

    return {
      statusCode: HttpStatus.OK,
      message: `${id}번 보드 삭제에 성공했습니다.`,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':boardId/members')
  async getBoardMembers(@Param('boardId') boardId: number, @Request() req) {
    const userId = req.user.id;
    const data = await this.boardService.getBoardMembers(boardId, userId);

    return {
      statusCode: HttpStatus.OK,
      message: '보드 멤버 조회에 성공했습니다.',
      data,
    };
  }
}
