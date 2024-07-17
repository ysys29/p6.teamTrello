import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { resolve } from 'path';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from 'src/user/entities/user.entity';
import { Board } from 'src/board/entities/board.entity';
import { Email } from 'src/email/entities/email.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { List } from 'src/list/entities/list.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardMember } from 'src/card/entities/card-member.entity';

import UserSeeder from './seeds/user.seeder';
import UserFactory from './factories/user.factory';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true',

  seeds: [UserSeeder],
  factories: [UserFactory],
  entities: [User, Email, Board, BoardMember, List, Card, CardMember, Comment],
};

console.log('DataSource Options:', options);

const dataSource = new DataSource(options);

(async () => {
  try {
    console.log('🚀 ~ initialize:');

    await dataSource.initialize();

    console.log('🚀 ~ runSeeders:');

    await runSeeders(dataSource);

    console.log('Seeding completed.');

    const allUsers = await dataSource.getRepository(User).find();

    console.log('🚀 ~ All users after seeding:', allUsers);
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    process.exit();
  }
})();

module.exports = dataSource;
