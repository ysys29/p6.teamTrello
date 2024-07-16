import { Faker } from '@faker-js/faker';
import { Board } from 'src/board/entities/board.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Board, (faker: Faker) => {
  const board = new Board();
  board.title = faker.lorem.words();
  board.description = faker.lorem.sentence();

  return board;
});
