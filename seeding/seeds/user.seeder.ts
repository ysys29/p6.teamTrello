import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(User);
    console.log('🚀 ~ UserSeeder ~ run ~ userFactory:', userFactory);

    const users = await userFactory.saveMany(10);
    console.log('🚀 ~ UserSeeder ~ run ~ users:', users);

    const allUsers = await dataSource.getRepository(User).find();
    console.log('🚀 ~ UserSeeder ~ run ~ allUsers:', allUsers);
  }
}
