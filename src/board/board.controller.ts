import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('보드')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * 제목으로 보드 검색
   * @param req
   * @param title
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '제목으로 보드 검색' }) //이 데코레이터는 해당 엔드포인트가 어떤 작업을 수행하는지 간략하게 설명합니다.
  @ApiResponse({ status: 200, description: '보드 검색에 성공했습니다.' }) //데코레이터는 엔드포인트의 응답에 대한 정보를 제공합니다.
  @ApiQuery({ name: 'title', required: true, description: '검색할 보드의 제목' })
  @Get('search')
  async searchBoards(@Request() req, @Query('title') title: string) {
    const userId = req.user.id;
    if (!title) {
      throw new BadRequestException('검색할 제목을 입력해 주세요.');
    }
    const data = await this.boardService.searchBoardsByTitle(Number(userId), title);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 검색에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 생성
   * @param createBoardDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '보드 생성' })
  @ApiResponse({ status: 201, description: '보드 생성에 성공했습니다.' })
  @ApiResponse({ status: 400, description: '보드 생성에 필요한 데이터를 입력해 주세요.' })
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

  /**
   * 보드 상세 조회
   * @param id
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '보드 상세 조회' })
  @ApiResponse({ status: 200, description: '보드 조회에 성공했습니다.' })
  @ApiResponse({ status: 404, description: '존재하지 않는 보드입니다.' })
  @ApiResponse({ status: 401, description: '해당 보드에 접근할 권한이 없습니다.' })
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

  /**
   * 보드 수정
   * @param id
   * @param updateBoardDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '보드 수정' })
  @ApiResponse({ status: 200, description: '보드 수정에 성공했습니다.' })
  @ApiResponse({ status: 400, description: '수정할 내용을 입력해 주세요.' })
  @ApiResponse({ status: 404, description: '존재하지 않는 보드입니다.' })
  @ApiResponse({ status: 401, description: '보드를 수정할 권한이 없습니다.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Request() req) {
    if (!updateBoardDto) {
      throw new BadRequestException('수정할 내용을 입력해 주세요.');
    }

    const userId = req.user.id;
    const data = await this.boardService.update(Number(id), updateBoardDto, userId);

    return {
      statusCode: HttpStatus.OK,
      message: `${id}번 보드 수정에 성공했습니다.`,
      data,
    };
  }

  /**
   * 보드 소프트 삭제
   * @param id
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '보드 소프트 삭제' })
  @ApiResponse({ status: 200, description: '보드 삭제에 성공했습니다.' })
  @ApiResponse({ status: 404, description: '존재하지 않는 보드입니다.' })
  @ApiResponse({ status: 401, description: '보드를 삭제할 권한이 없습니다.' })
  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    await this.boardService.softDelete(Number(id), userId);

    return {
      statusCode: HttpStatus.OK,
      message: `${id}번 보드 삭제에 성공했습니다.`,
    };
  }

  /**
   * 보드 멤버 조회
   * @param boardId
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '보드 멤버 조회' })
  @ApiResponse({ status: 200, description: '보드 멤버 조회에 성공했습니다.' })
  @ApiResponse({ status: 404, description: '해당 보드에 접근할 권한이 없습니다.' })
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
