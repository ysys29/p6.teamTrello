import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { ReorderListDto } from './dtos/reorder-list.dto';
import { CreateListDto } from './dtos/creaet-list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('리스트')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 리스트 생성
   * @param craeteListDto
   * @returns
   */
  // 리스트 생성
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createList(@Request() req, @Body() craeteListDto: CreateListDto) {
    return await this.listService.createList(req.user.id, craeteListDto);
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
    return await this.listService.getList(req.user.id, listId);
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
  async updateListTitle(@Request() req, @Param('listId') listId: number, @Body('title') title: string) {
    return await this.listService.updateListTitle(req.user.id, listId, title);
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
    return await this.listService.reorderList(req.user.id, listId, reorderListDto);
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
    return await this.listService.deleteList(req.user.id, listId);
  }

  // 리스트 목록 조회 // 리스트 순서 변경 제대로 되나 확인용 api == 삭제 요
  @Get()
  async getAllLists(@Body('boardId') boardId: number) {
    return await this.listService.getAllLists(boardId);
  }
}
