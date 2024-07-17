import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

export default setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = bcrypt.hashSync('Password1!', 10);
  user.nickname = faker.internet.userName();
  user.imgUrl = faker.image.url();

  return user;
});
