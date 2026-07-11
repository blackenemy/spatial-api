import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { PlaceFeatureDto, PlaceFeatureCollectionDto } from './dto/place.response';
import { ConformanceDto, CollectionsResponseDto, CollectionDto } from './dto/ogc.response';

@ApiTags('ogc')
@Controller()
export class OgcController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('conformance')
  @ApiOperation({ summary: 'OGC conformance classes' })
  @ApiResponse({ status: 200, description: 'Conformance classes this API meets', type: ConformanceDto })
  conformance() {
    return {
      conformsTo: [
        'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core',
        'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson',
        'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30',
      ],
    };
  }

  @Get('collections')
  @ApiOperation({ summary: 'List feature collections (OGC API)' })
  @ApiResponse({ status: 200, description: 'List of available feature collections', type: CollectionsResponseDto })
  collections() {
    return {
      collections: [
        {
          id: 'places',
          title: 'Places',
          description: 'Spatial places across Thailand (points, lines, polygons)',
          extent: {
            spatial: { bbox: [[94.0, 5.0, 110.0, 21.0]], crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84' },
          },
          itemType: 'feature',
          crs: ['http://www.opengis.net/def/crs/OGC/1.3/CRS84'],
          links: [
            { rel: 'items', href: '/collections/places/items', type: 'application/geo+json' },
          ],
        },
      ],
      links: [
        { rel: 'self', href: '/collections', type: 'application/json' },
      ],
    };
  }

  @Get('collections/places')
  @ApiOperation({ summary: 'Collection metadata for places (OGC API)' })
  @ApiResponse({ status: 200, description: 'Collection metadata', type: CollectionDto })
  collection() {
    return this.collections().collections[0];
  }

  @Get('collections/places/items')
  @ApiOperation({ summary: 'List features as GeoJSON (OGC API)' })
  @ApiTags('ogc')
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection', type: PlaceFeatureCollectionDto })
  async items(
    @Query('bbox') bbox?: string,
    @Query('type') type?: string,
    @Query('q') q?: string,
  ): Promise<PlaceFeatureCollectionDto> {
    return this.placesService.findAll(bbox, type, q);
  }

  @Get('collections/places/items/:id')
  @ApiOperation({ summary: 'Single feature as GeoJSON (OGC API)' })
  @ApiResponse({ status: 200, description: 'GeoJSON Feature', type: PlaceFeatureDto })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  async item(@Param('id') id: string): Promise<PlaceFeatureDto> {
    return this.placesService.findOne(id);
  }
}
