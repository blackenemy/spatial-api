import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceEntity } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceFeatureDto, PlaceFeatureCollectionDto } from './dto/place.response';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly placesRepository: Repository<PlaceEntity>,
  ) {}

  async findAll(
    bbox?: string,
    type?: string,
    q?: string,
  ): Promise<PlaceFeatureCollectionDto> {
    let query = this.placesRepository.createQueryBuilder('p');

    if (type) {
      query = query.where('p.type = :type', { type });
    }
    if (q) {
      query = query.andWhere('p.name ILIKE :q', { q: `%${q}%` });
    }
    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);
      // ST_MakeEnvelope(minLng, minLat, maxLng, maxLat, 4326)
      // && operator: bounding box overlap
      query = query.andWhere(
        `p.geom && ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)`,
        { minLng, minLat, maxLng, maxLat },
      );
    }

    const places = await query.orderBy('p.createdAt', 'DESC').getMany();
    return this.toFeatureCollection(places);
  }

  async findNearby(
    lng: number,
    lat: number,
    radius: number,
  ): Promise<PlaceFeatureCollectionDto> {
    // ST_DWithin with geography cast for meters
    const places = await this.placesRepository
      .createQueryBuilder('p')
      .where(
        `ST_DWithin(ST_Transform(p.geom, 4326)::geography, ST_Point(:lng, :lat)::geography, :radius)`,
        { lng, lat, radius },
      )
      .orderBy(
        'ST_Distance(ST_Transform(p.geom, 4326)::geography, ST_Point(:lng, :lat)::geography)',
        'ASC',
      )
      .setParameter('lng', lng)
      .setParameter('lat', lat)
      .setParameter('radius', radius)
      .getMany();
    return this.toFeatureCollection(places);
  }

  async findWithin(polygon: object): Promise<PlaceFeatureCollectionDto> {
    // ST_Within: return places whose geometry falls inside the given GeoJSON polygon.
    const places = await this.placesRepository
      .createQueryBuilder('p')
      .where('ST_Within(p.geom, ST_SetSRID(ST_GeomFromGeoJSON(:poly), 4326))', {
        poly: JSON.stringify(polygon),
      })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    return this.toFeatureCollection(places);
  }

  async findOne(id: string): Promise<PlaceFeatureDto> {
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
    return this.toFeature(place);
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<PlaceFeatureDto> {
    const id = this.generateUUID();
    const place = this.placesRepository.create({
      id,
      name: createPlaceDto.name,
      type: createPlaceDto.type,
      description: createPlaceDto.description,
      geom: createPlaceDto.geometry,
    });
    const saved = await this.placesRepository.save(place);
    return this.toFeature(saved);
  }

  async update(
    id: string,
    updatePlaceDto: UpdatePlaceDto,
  ): Promise<PlaceFeatureDto> {
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
    if (updatePlaceDto.name !== undefined) {
      place.name = updatePlaceDto.name;
    }
    if (updatePlaceDto.type !== undefined) {
      place.type = updatePlaceDto.type;
    }
    if (updatePlaceDto.description !== undefined) {
      place.description = updatePlaceDto.description;
    }
    if (updatePlaceDto.geometry !== undefined) {
      place.geom = updatePlaceDto.geometry;
    }
    const updated = await this.placesRepository.save(place);
    return this.toFeature(updated);
  }

  async delete(id: string): Promise<void> {
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
    await this.placesRepository.remove(place);
  }

  private generateUUID(): string {
    // ponytail: simple UUID v4 from crypto.randomUUID (Node 15+)
    return crypto.randomUUID();
  }

  private toFeature(place: PlaceEntity): PlaceFeatureDto {
    const geom =
      typeof place.geom === 'string' ? JSON.parse(place.geom) : place.geom;
    return {
      type: 'Feature',
      id: place.id,
      geometry: geom as any,
      properties: {
        name: place.name,
        type: place.type as any,
        description: place.description || null,
        createdAt: place.createdAt.toISOString(),
      },
    };
  }

  private toFeatureCollection(places: PlaceEntity[]): PlaceFeatureCollectionDto {
    return {
      type: 'FeatureCollection',
      features: places.map((p) => this.toFeature(p)),
    };
  }
}
