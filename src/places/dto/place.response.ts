import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type PlaceType = 'school' | 'restaurant' | 'attraction' | 'cafe' | 'hospital' | 'other';

export class PlacePropertiesDto {
  @ApiProperty({ example: 'มหาวิทยาลัยขอนแก่น' })
  name!: string;

  @ApiProperty({ enum: ['school', 'restaurant', 'attraction', 'cafe', 'hospital', 'other'], example: 'school' })
  type!: PlaceType;

  @ApiPropertyOptional({ example: 'มหาวิทยาลัยชั้นนำในภาคตะวันออกเฉียงเหนือ', nullable: true })
  description!: string | null;

  @ApiProperty({ example: '2026-07-11T09:00:00.000Z' })
  createdAt!: string;
}

export class PointGeometryDto {
  @ApiProperty({ enum: ['Point'], example: 'Point' })
  type!: string;

  @ApiProperty({ example: [102.822281, 16.474635], description: '[longitude, latitude]' })
  coordinates!: [number, number];
}

export class LineStringGeometryDto {
  @ApiProperty({ enum: ['LineString'], example: 'LineString' })
  type!: string;

  @ApiProperty({ example: [[100.5018, 13.7563], [100.51, 13.76]], description: 'Array of [lng, lat] pairs' })
  coordinates!: [number, number][];
}

export class PolygonGeometryDto {
  @ApiProperty({ enum: ['Polygon'], example: 'Polygon' })
  type!: string;

  @ApiProperty({ example: [[[100.5018, 13.7563], [100.51, 13.76], [100.5018, 13.7563]]], description: 'Array of linear rings (outer ring + optional holes)' })
  coordinates!: [number, number][][];
}

export class PlaceFeatureDto {
  @ApiProperty({ example: '6242fc6bd444333c95ae47a6', description: 'Place UUID' })
  id!: string;

  @ApiProperty({ enum: ['Feature'], example: 'Feature' })
  type!: string;

  @ApiProperty({ type: () => PointGeometryDto, description: 'Geometry (Point, LineString, or Polygon)' })
  geometry!: PointGeometryDto | LineStringGeometryDto | PolygonGeometryDto;

  @ApiProperty({ type: PlacePropertiesDto })
  properties!: PlacePropertiesDto;
}

export class PlaceFeatureCollectionDto {
  @ApiProperty({ enum: ['FeatureCollection'], example: 'FeatureCollection' })
  type!: string;

  @ApiProperty({ type: [PlaceFeatureDto], description: 'Array of GeoJSON Features' })
  features!: PlaceFeatureDto[];
}
