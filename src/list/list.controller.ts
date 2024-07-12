import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ListService } from './list.service';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // 리스트 생성
  @Post()
  async createList(@Body('userId') userId: number, @Body('boardId') boardId: number, @Body('title') title: string) {
    return await this.listService.createList(userId, boardId, title);
  }

  // 리스트 상세 조회
  @Get(':listId')
  async getList(@Param('listId') listId: number) {
    return await this.listService.getList(listId);
  }

  // 리스트 이름(title) 수정
  @Patch(':listId/title')
  async updateListTitle(@Param('listId') listId: number, @Body('title') title: string) {
    return await this.listService.updateListTitle(listId, title);
  }

  // 리스트 삭제
  @Delete(':listId')
  async deleteList(@Param('listId') listId: number) {
    return await this.listService.deleteList(listId);
  }
}
