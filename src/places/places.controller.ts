import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { WithinDto } from './dto/within.dto';
import { PlaceFeatureDto, PlaceFeatureCollectionDto } from './dto/place.response';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @ApiQuery({ name: 'bbox', required: false, description: 'Bounding box as minLng,minLat,maxLng,maxLat', example: '100.5,13.7,100.6,13.8' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by place type', example: 'restaurant' })
  @ApiQuery({ name: 'q', required: false, description: 'Search by name', example: 'Starbucks' })
  @ApiResponse({ status: 200, description: 'List of places as GeoJSON FeatureCollection', type: PlaceFeatureCollectionDto })
  async findAll(
    @Query('bbox') bbox?: string,
    @Query('type') type?: string,
    @Query('q') q?: string,
  ): Promise<PlaceFeatureCollectionDto> {
    return this.placesService.findAll(bbox, type, q);
  }

  @Get('nearby')
  @ApiQuery({ name: 'lng', required: true, description: 'Longitude', example: '100.5018' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude', example: '13.7563' })
  @ApiQuery({ name: 'radius', required: true, description: 'Radius in meters', example: '1000' })
  @ApiResponse({ status: 200, description: 'Places within radius as GeoJSON FeatureCollection', type: PlaceFeatureCollectionDto })
  async findNearby(
    @Query('lng') lng: string,
    @Query('lat') lat: string,
    @Query('radius') radius: string,
  ): Promise<PlaceFeatureCollectionDto> {
    return this.placesService.findNearby(parseFloat(lng), parseFloat(lat), parseFloat(radius));
  }

  @Post('within')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: WithinDto, description: 'Find places inside a GeoJSON polygon (PostGIS ST_Within)' })
  @ApiResponse({ status: 200, description: 'Places inside the polygon as GeoJSON FeatureCollection', type: PlaceFeatureCollectionDto })
  async findWithin(@Body() dto: WithinDto): Promise<PlaceFeatureCollectionDto> {
    return this.placesService.findWithin(dto.polygon);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Place UUID', example: '6242fc6bd444333c95ae47a6' })
  @ApiResponse({ status: 200, description: 'Place details as GeoJSON Feature', type: PlaceFeatureDto })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async findOne(@Param('id') id: string): Promise<PlaceFeatureDto> {
    return this.placesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreatePlaceDto,
    description: 'Create a new place',
    examples: {
      point: {
        summary: 'Create a Point place',
        value: {
          name: 'มหาวิทยาลัยขอนแก่น',
          type: 'school',
          description: 'มหาวิทยาลัยชั้นนำในภาคตะวันออกเฉียงเหนือ',
          geometry: { type: 'Point', coordinates: [102.822281, 16.474635] },
        },
      },
      linestring: {
        summary: 'Create a LineString place',
        value: {
          name: 'BTS Sukhumvit Line',
          type: 'attraction',
          geometry: { type: 'LineString', coordinates: [[100.5018, 13.7563], [100.51, 13.76]] },
        },
      },
      polygon: {
        summary: 'Create a Polygon place',
        value: {
          name: 'Lumpini Park',
          type: 'attraction',
          geometry: { type: 'Polygon', coordinates: [[[100.5018, 13.7563], [100.51, 13.76], [100.5018, 13.7563]]] },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Place created as GeoJSON Feature', type: PlaceFeatureDto })
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<PlaceFeatureDto> {
    return this.placesService.create(createPlaceDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Place UUID', example: '6242fc6bd444333c95ae47a6' })
  @ApiBody({
    type: UpdatePlaceDto,
    description: 'Update a place (partial)',
    examples: {
      rename: {
        summary: 'Rename',
        value: { name: 'New name' },
      },
      changeType: {
        summary: 'Change type + description',
        value: { type: 'restaurant', description: 'Changed to restaurant' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Place updated as GeoJSON Feature', type: PlaceFeatureDto })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<PlaceFeatureDto> {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'Place UUID', example: '6242fc6bd444333c95ae47a6' })
  @ApiResponse({ status: 204, description: 'Place deleted' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.placesService.delete(id);
  }
}
