import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { CreateCardMeberDto } from './dto/create-card-member.dto';
import { SearchCardParamsDto } from './dto/search-card.dto';
import { SearchCardMemeberParamsDto } from './dto/search-card-member.dto';
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
   * @param cardId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':cardId')
  async findOne(@Param() searchCardParam: SearchCardParamsDto) {
    const data = await this.cardService.findOne(searchCardParam.cardId);
    return {
      statusCode: 201,
      message: '카드 상세 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 수정
   * @param cardId
   * @param updateCardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':cardId')
  async update(@Param() searchCardParam: SearchCardParamsDto, @Body() updateCardDto: UpdateCardDto) {
    const data = await this.cardService.update(searchCardParam.cardId, updateCardDto);
    return {
      statusCode: 201,
      message: '카드 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 삭제
   * @param cardId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':cardId')
  async remove(@Param() searchCardParam: SearchCardParamsDto) {
    const data = await this.cardService.remove(searchCardParam.cardId);
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
  async reorderCard(@Param() searchCardParam: SearchCardParamsDto, @Body() reorderCardDto: ReorderCardDto) {
    return await this.cardService.reorderCard(searchCardParam.cardId, reorderCardDto);
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
  async choiceWorker(@Param() searchCardParam: SearchCardParamsDto, @Body() createCardMeberDto: CreateCardMeberDto) {
    return await this.cardService.choiceWorker(searchCardParam.cardId, createCardMeberDto);
  }

  /**
   * 카드 작업자 정보 조회
   * @param cardId
   * @param userId
   * @returns
   */
  @Get(':cardId/workers/:userId')
  async findWorker(@Param() searchCardMemeberParam: SearchCardMemeberParamsDto) {
    return await this.cardService.findWorker(searchCardMemeberParam.cardId, searchCardMemeberParam.userId);
  }

  /**
   * 카드 작업자 삭제
   * @param cardId
   * @param workerId
   * @returns
   */
  @Delete(':cardId/workers/:workerId')
  async deleteWorker(@Param() searchCardMemeberParam: SearchCardMemeberParamsDto) {
    return await this.cardService.deleteWorker(searchCardMemeberParam.cardId, searchCardMemeberParam.userId);
  }
}
