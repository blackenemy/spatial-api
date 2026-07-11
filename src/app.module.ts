import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesModule } from './places/places.module';
import { PlaceEntity } from './places/entities/place.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [PlaceEntity],
      synchronize: false,
      migrations: ['dist/migrations/*.migration.js'],
      migrationsRun: true,
      logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    }),
    PlacesModule,
  ],
})
export class AppModule {}
