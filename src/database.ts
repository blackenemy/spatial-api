import { DataSource } from 'typeorm';
import { PlaceEntity } from './places/entities/place.entity';
import { InitialSchema1730000000000 } from './migrations/1_initial_schema.migration';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [PlaceEntity],
  migrations: [InitialSchema1730000000000],
  synchronize: false,
  logging: ['error'],
});
