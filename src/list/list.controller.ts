import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
