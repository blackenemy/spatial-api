import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('places')
@Index('idx_places_geom', { synchronize: false })
export class PlaceEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 120 })
  name!: string;

  @Column('varchar')
  type!: string;

  @Column('varchar', { length: 500, nullable: true })
  description!: string;

  @Column('geometry', { srid: 4326 })
  geom!: object;

  @CreateDateColumn()
  createdAt!: Date;
}
