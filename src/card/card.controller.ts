import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReorderCardDto } from './dto/reorder-card.dto';
import { CreateCardMemberDto } from './dto/create-card-member.dto';
import { SearchCardParamsDto } from './dto/search-card.dto';
import { SearchCardMemeberParamsDto } from './dto/search-card-member.dto';
import { HttpStatus } from '@nestjs/common';

@ApiTags('8. 카드')
@Controller('cards')
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
    const data = await this.cardService.createCard(createCardDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '카드 생성에 성공했습니다.',
      data,
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
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
      message: '카드 수정에 성공했습니다.',
      data,
    };
  }

  // /**
  //  * 카드 삭제
  //  * @param cardId
  //  * @returns
  //  */
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':cardId')
  // async remove(@Param() searchCardParam: SearchCardParamsDto) {
  //   const data = await this.cardService.remove(searchCardParam.cardId);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: '카드 삭제에 성공했습니다.',
  //     data,
  //   };
  // }

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
    const data = await this.cardService.reorderCard(searchCardParam.cardId, reorderCardDto);
    return {
      statusCode: HttpStatus.OK,
      message: '카드 순서 변경에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 작업자 할당
   * @param cardId
   * @param workersDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':cardId/workers')
  async choiceWorker(@Param() searchCardParam: SearchCardParamsDto, @Body() createCardMeberDto: CreateCardMemberDto) {
    const data = await this.cardService.choiceWorker(searchCardParam.cardId, createCardMeberDto);
    return {
      statusCode: HttpStatus.OK,
      message: '카드 작업자 할당에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 작업자 삭제
   * @param cardId
   * @param userId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':cardId/workers/:userId')
  async deleteWorker(@Param() searchCardMemeberParam: SearchCardMemeberParamsDto) {
    const data = await this.cardService.deleteWorker(searchCardMemeberParam.cardId, searchCardMemeberParam.userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: '카드 작업자 삭제에 성공했습니다.',
      data,
    };
  }
}
