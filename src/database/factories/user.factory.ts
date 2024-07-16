import { Faker } from '@faker-js/faker';
import { User } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';

export default setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = bcrypt.hashSync('Password1!', 10);
  user.nickname = faker.person.fullName();
  user.imgUrl = faker.image.url();

  return user;
});
