import {
  IsString,
  IsEnum,
  IsObject,
  IsArray,
  IsNumber,
  Length,
  ValidateNested,
  IsOptional,
  MaxLength,
  ValidateBy,
} from 'class-validator';
import { Type } from 'class-transformer';

export type PlaceType = 'school' | 'restaurant' | 'attraction' | 'cafe' | 'hospital' | 'other';

const GEOMETRY_TYPES = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'];

function isValidGeometry(value: any): boolean {
  if (!value || typeof value !== 'object') return false;
  if (!GEOMETRY_TYPES.includes(value.type)) return false;
  if (!Array.isArray(value.coordinates) || value.coordinates.length === 0) return false;
  return true;
}

export class CreatePlaceDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsEnum(['school', 'restaurant', 'attraction', 'cafe', 'hospital', 'other'])
  type!: PlaceType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsObject()
  @ValidateBy({
    name: 'isValidGeometry',
    validator: (value: any) => isValidGeometry(value),
  })
  geometry!: { type: string; coordinates: any };
}
