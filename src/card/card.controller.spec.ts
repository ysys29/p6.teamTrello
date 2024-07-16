import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';

describe('CardController', () => {
  let cardcontroller: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [CardService],
    }).compile();

    cardcontroller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(cardcontroller).toBeDefined();
  });

  describe('findOne', () => {
    it('findOne test', async () => {
      // Given
      // When
      // Then
    });
  });
});
