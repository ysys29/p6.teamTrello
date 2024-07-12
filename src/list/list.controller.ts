import { Body, Controller, Post } from '@nestjs/common';
import { ListService } from './list.service';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // 리스트 생성
  @Post()
  async createList(@Body('userId') userId: number, @Body('boardId') boardId: number, @Body('title') title: string) {
    return await this.listService.createList(userId, boardId, title);
  }
}
