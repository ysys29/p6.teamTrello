import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { CreateCardMeberDto } from './dto/create-card-member.dto';
@ApiTags('카드 정보')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  /**
   * 카드 생성
   * @param createCardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    const data = await this.cardService.create(createCardDto);
    return {
      statusCode: 201,
      message: '카드 생성에 성공했습니다.',
      data,
    };
  }
  /**
   * 카드 목록 조회
   * @returns
   */

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    const data = await this.cardService.findAll();
    return {
      statusCode: 200,
      message: '카드 목록 조회에 성공했습니다.',
      data: data,
    };
  }

  /**
   * 카드 상세 조회
   * @param id
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.cardService.findOne(+id);
    return {
      statusCode: 201,
      message: '카드 상세 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 수정
   * @param id
   * @param updateCardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const data = await this.cardService.update(+id, updateCardDto);
    return {
      statusCode: 201,
      message: '카드 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 삭제
   * @param id
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.cardService.remove(+id);
    return {
      statusCode: 200,
      message: '카드 삭제에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 순서 변경
   * @param cardId
   * @param reorderCardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':cardId/reorder')
  async reorderCard(@Param('cardId') cardId: number, @Body() reorderCardDto: ReorderCardDto) {
    return await this.cardService.reorderCard(cardId, reorderCardDto);
  }

  /**
   * 카드 작업자 할당
   * @param cardId
   * @param workersDto
   * @returns
   */
  //@ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
  @Post(':cardId/workers')
  async choiceWorker(@Param('cardId') cardId: number, @Body() createCardMeberDto: CreateCardMeberDto) {
    return await this.cardService.choiceWorker(cardId, createCardMeberDto);
  }

  /**
   * 카드 작업자 정보 조회
   * @param cardId
   * @param workerId
   * @returns
   */
  @Get(':cardId/workers/:workerId')
  async findWorker(@Param('cardId') cardId: number, @Param('workerId') workerId: number) {
    return await this.cardService.findWorker(cardId, workerId);
  }
}
