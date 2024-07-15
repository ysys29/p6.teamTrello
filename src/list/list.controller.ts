import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { ReorderListDto } from './dtos/reorder-list.dto';
import { CreateListDto } from './dtos/create-list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateListDto } from './dtos/update-list.dto';

@ApiTags('리스트')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 리스트 생성
   * @param createListDto
   * @returns
   */
  // 리스트 생성
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createList(@Request() req, @Body() createListDto: CreateListDto) {
    const data = await this.listService.createList(req.user.id, createListDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '리스트를 생성했습니다.',
      data,
    };
  }

  /**
   * 리스트 상세 조회
   * @param listId
   * @returns
   */
  // 리스트 상세 조회
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':listId')
  async getList(@Request() req, @Param('listId') listId: number) {
    const data = await this.listService.getList(req.user.id, listId);

    return {
      statusCode: HttpStatus.OK,
      message: `${listId}번 리스트 조회에 성공했습니다.`,
      data,
    };
  }

  /**
   * 리스트 이름 수정
   * @param listId
   * @param title
   * @returns
   */
  // 리스트 이름(title) 수정
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':listId/title')
  async updateListTitle(@Request() req, @Param('listId') listId: number, @Body() updateListDto: UpdateListDto) {
    const data = await this.listService.updateListTitle(req.user.id, listId, updateListDto);

    return {
      statusCode: HttpStatus.OK,
      message: `${listId}번 리스트의 이름을 수정했습니다.`,
      data,
    };
  }

  /**
   * 리스트 순서 변경
   * @param listId
   * @param reorderListDto
   * @returns
   */
  // 리스트 순서 변경
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':listId/reorder')
  async reorderList(@Request() req, @Param('listId') listId: number, @Body() reorderListDto: ReorderListDto) {
    const data = await this.listService.reorderList(req.user.id, listId, reorderListDto);

    return {
      statusCode: HttpStatus.OK,
      message: `${listId}번 리스트의 순서를 변경했습니다.`,
      data,
    };
  }

  /**
   * 리스트 삭제
   * @param listId
   * @returns
   */
  // 리스트 삭제
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':listId')
  async deleteList(@Request() req, @Param('listId') listId: number) {
    const data = await this.listService.deleteList(req.user.id, listId);

    return {
      statusCode: HttpStatus.OK,
      message: `${listId}번 리스트 삭제에 성공했습니다.`,
      data,
    };
  }
}
