import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730000000000 implements MigrationInterface {
  name = 'InitialSchema1730000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis');

    // Create places table
    await queryRunner.query(`
      CREATE TABLE "places" (
        "id" uuid PRIMARY KEY NOT NULL,
        "name" character varying(120) NOT NULL,
        "type" character varying NOT NULL,
        "description" character varying(500),
        "geom" geometry(Geometry, 4326) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create GIST index on geometry column for spatial queries
    await queryRunner.query(`
      CREATE INDEX "idx_places_geom" ON "places" USING GIST ("geom")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "idx_places_geom"');
    await queryRunner.query('DROP TABLE IF EXISTS "places"');
  }
}
