import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.cardService.remove(+id);
    return {
      statusCode: 200,
      message: '카드 삭제에 성공했습니다.',
      data,
    };
  }
}
