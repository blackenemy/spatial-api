import { ApiProperty } from '@nestjs/swagger';

export class ConformanceDto {
  @ApiProperty({
    example: [
      'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core',
      'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson',
      'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30',
    ],
    description: 'List of OGC conformance classes this API implements',
  })
  conformsTo!: string[];
}

export class CollectionExtentBboxDto {
  @ApiProperty({ example: [[94.0, 5.0, 110.0, 21.0]], description: 'Bounding box as [minLng, minLat, maxLng, maxLat]' })
  bbox!: number[][];

  @ApiProperty({ example: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84' })
  crs!: string;
}

export class CollectionLinkDto {
  @ApiProperty({ example: 'items' })
  rel!: string;

  @ApiProperty({ example: '/collections/places/items' })
  href!: string;

  @ApiProperty({ example: 'application/geo+json' })
  type!: string;
}

export class CollectionDto {
  @ApiProperty({ example: 'places' })
  id!: string;

  @ApiProperty({ example: 'Places' })
  title!: string;

  @ApiProperty({ example: 'Spatial places across Thailand (points, lines, polygons)' })
  description!: string;

  @ApiProperty({ type: CollectionExtentBboxDto })
  extent!: CollectionExtentBboxDto;

  @ApiProperty({ example: 'feature' })
  itemType!: string;

  @ApiProperty({ example: ['http://www.opengis.net/def/crs/OGC/1.3/CRS84'] })
  crs!: string[];

  @ApiProperty({ type: [CollectionLinkDto] })
  links!: CollectionLinkDto[];
}

export class CollectionsResponseDto {
  @ApiProperty({ type: [CollectionDto] })
  collections!: CollectionDto[];

  @ApiProperty({ type: [CollectionLinkDto] })
  links!: CollectionLinkDto[];
}
