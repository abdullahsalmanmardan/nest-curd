import { ConfigModule, ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity'; // Adjust the path based on your folder structure

ConfigModule.forRoot(); // Load environment variables

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'learning-nest'),
  entities: [User],
  migrations: ['src/migrations/*.ts'], // Ensure migrations path is correct
  synchronize: true, // Set to true to automatically create tables
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
