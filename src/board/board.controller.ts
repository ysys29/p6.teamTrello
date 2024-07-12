import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board } from './entities/board.entity';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post() // 요청 본문에 포함된 데이터를 사용하여 새보드를 생성, 이를 데이터베이스에 저장합니다.
  async create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id') //URL주소에 전달된 ID를 사용하여 해당 보드를 조회
  async findOne(@Param('id') id: number): Promise<Board> {
    return this.boardService.findOne(id);
  }

  @Patch(':id') //URL주소에 전달된 ID를 사용하여 해당 보드를 수정
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(Number(id), updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
