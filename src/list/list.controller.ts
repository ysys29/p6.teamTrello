import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
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
  async createList(@Request() user, @Body() createListDto: CreateListDto) {
    return await this.listService.createList(user.id, createListDto);
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
  async getList(@Request() user, @Param('listId') listId: number) {
    return await this.listService.getList(user.id, listId);
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
  async updateListTitle(@Request() user, @Param('listId') listId: number, @Body() updateListDto: UpdateListDto) {
    return await this.listService.updateListTitle(user.id, listId, updateListDto);
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
  async reorderList(@Request() user, @Param('listId') listId: number, @Body() reorderListDto: ReorderListDto) {
    return await this.listService.reorderList(user.id, listId, reorderListDto);
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
  async deleteList(@Request() user, @Param('listId') listId: number) {
    return await this.listService.deleteList(user.id, listId);
  }
}
