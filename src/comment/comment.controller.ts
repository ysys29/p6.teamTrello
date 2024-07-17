import { Controller, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchCommentDto } from './dto/search-comment.dto';

@ApiTags('댓글')
@Controller('comments')
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
   * 댓글수정
   * @param updateCommentDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Req() req, @Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    const userId = req.user.id;
    const data = await this.commentService.update(id, userId, updateCommentDto);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글삭제
   *@param
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    const data = await this.commentService.remove(id, userId, SearchCommentDto);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 삭제에 성공했습니다.',
      data,
    };
  }
}
