import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import { number } from 'joi';

@ApiTags('댓글')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글생성
   * @param createCommentDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user.id;
    const data = await this.commentService.create(userId, createCommentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '댓글 생성에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글조회
   *
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    const data = await this.commentService.findAll();
    return {
      statusCode: 200,
      message: '댓글 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글수정
   * @param updateCommentDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  //파라미터에 수정 댓글 아이디 넣기
  async update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    const data = await this.commentService.update(id, updateCommentDto);
    return {
      statusCode: 200,
      message: '댓글 수정에 성공했습니다.',
      data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentService.remove(id);
  }
}
