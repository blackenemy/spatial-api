import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from './entities/place.entity';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { OgcController } from './ogc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity])],
  controllers: [PlacesController, OgcController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
