import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class WithinDto {
  @ApiProperty({
    description: 'GeoJSON Polygon to search within — returns places inside it',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [100.45, 13.6],
          [100.6, 13.6],
          [100.6, 13.85],
          [100.45, 13.85],
          [100.45, 13.6],
        ],
      ],
    },
  })
  @IsObject()
  polygon!: { type: string; coordinates: number[][][] };
}
