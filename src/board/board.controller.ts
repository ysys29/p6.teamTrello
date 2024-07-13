import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board } from './entities/board.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('보드')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth() // 애가 토큰인증해주는애
  @UseGuards(AuthGuard('jwt')) // 모든 엔드포인트에 대해 JWT 인증 적용
  @Post() // 요청 본문에 포함된 데이터를 사용하여 새 보드를 생성, 이를 데이터베이스에 저장합니다.
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    const userId = req.user.id; // JWT 토큰에서 사용자 ID 추출
    return this.boardService.create(createBoardDto, userId);
  }
  // 보드에 멤버가 추가되면 추후에 작성 예정
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id') // URL 주소에 전달된 ID를 사용하여 해당 보드를 조회
  async findOne(@Param('id') id: number, @Request() req): Promise<Board> {
    const userId = req.user.id; // JWT 토큰에서 사용자 ID 추출
    return this.boardService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id') // URL 주소에 전달된 ID를 사용하여 해당 보드를 수정
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Request() req) {
    const userId = req.user.id; // JWT 토큰에서 사용자 ID 추출
    return this.boardService.update(Number(id), updateBoardDto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // JWT 토큰에서 사용자 ID 추출
    return this.boardService.remove(Number(id), userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':boardId/members') // URL 주소에 전달된 보드 ID를 사용하여 보드 멤버 조회
  async getBoardMembers(@Param('boardId') boardId: number, @Request() req) {
    const userId = req.user.id; // JWT 토큰에서 사용자 ID 추출
    return this.boardService.getBoardMembers(boardId, userId);
  }
}
