import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ListService } from './list.service';
import { ReorderListDto } from './dtos/reorder-list.dto';
import { CreateListDto } from './dtos/creaet-list.dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // 리스트 생성
  @Post()
  async createList(@Body('userId') userId: number, @Body() craeteListDto: CreateListDto) {
    return await this.listService.createList(userId, craeteListDto);
  }

  // 리스트 상세 조회
  @Get(':listId')
  async getList(@Body('userId') userId: number, @Param('listId') listId: number) {
    return await this.listService.getList(userId, listId);
  }

  // 리스트 이름(title) 수정
  @Patch(':listId/title')
  async updateListTitle(@Body('userId') userId: number, @Param('listId') listId: number, @Body('title') title: string) {
    return await this.listService.updateListTitle(userId, listId, title);
  }

  // 리스트 순서 변경
  @Patch(':listId/reorder')
  async reorderList(
    @Body('userId') userId: number,
    @Param('listId') listId: number,
    @Body() reorderListDto: ReorderListDto,
  ) {
    return await this.listService.reorderList(userId, listId, reorderListDto);
  }

  // 리스트 삭제
  @Delete(':listId')
  async deleteList(@Body('userId') userId: number, @Param('listId') listId: number) {
    return await this.listService.deleteList(userId, listId);
  }

  // 리스트 목록 조회 // 리스트 순서 변경 제대로 되나 확인용 api == 삭제 요
  @Get()
  async getAllLists(@Body('boardId') boardId: number) {
    return await this.listService.getAllLists(boardId);
  }
}
