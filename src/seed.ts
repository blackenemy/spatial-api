import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PlaceEntity } from './places/entities/place.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [PlaceEntity],
  migrations: [],
  synchronize: false,
  logging: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const placesRepository = AppDataSource.getRepository(PlaceEntity);

    // Clear existing data (TRUNCATE — empty criteria delete is rejected by TypeORM)
    await placesRepository.clear();
    console.log('Cleared existing places');

    // Sample places around Bangkok
    const places = [
      {
        id: crypto.randomUUID(),
        name: 'Bangkok Administrative District (Polygon)',
        type: 'attraction',
        description:
          'Administrative boundary of Bangkok, demonstrating Polygon geometry support.',
        geom: {
          type: 'Polygon',
          coordinates: [
            [
              [100.4, 13.6],
              [100.7, 13.6],
              [100.7, 13.8],
              [100.4, 13.8],
              [100.4, 13.6],
            ],
          ],
        },
      },
      {
        id: crypto.randomUUID(),
        name: 'BTS Skytrain Line (LineString)',
        type: 'attraction',
        description:
          'Major transit route through Bangkok, demonstrating LineString geometry support.',
        geom: {
          type: 'LineString',
          coordinates: [
            [100.5247, 13.7539],
            [100.5312, 13.7453],
            [100.54, 13.76],
            [100.5597, 13.7381],
          ],
        },
      },
      {
        id: crypto.randomUUID(),
        name: 'Siam School of Languages',
        type: 'school',
        description:
          'Modern language academy offering English, Thai, and Mandarin courses for all levels.',
        geom: { type: 'Point', coordinates: [100.5247, 13.7539] }, // Siam, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Gaggan Angsana',
        type: 'restaurant',
        description:
          'Fine dining Indian restaurant serving contemporary interpretations of classic recipes.',
        geom: { type: 'Point', coordinates: [100.4908, 13.7313] }, // Silom, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Grand Palace',
        type: 'attraction',
        description:
          'The official residence of Thai kings since 1782, featuring stunning architecture and cultural significance.',
        geom: { type: 'Point', coordinates: [100.4934, 13.6515] }, // Phra Nakhon, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'After You Dessert Cafe',
        type: 'cafe',
        description:
          'Popular dessert cafe known for shaved ice creations and a wide variety of sweet treats.',
        geom: { type: 'Point', coordinates: [100.5312, 13.7453] }, // Pathum Wan, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Bumrungrad International Hospital',
        type: 'hospital',
        description:
          "Asia's largest private international hospital with comprehensive medical services and specialist care.",
        geom: { type: 'Point', coordinates: [100.555, 13.7383] }, // Silom, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Lumpini Park',
        type: 'attraction',
        description:
          "Large public park with scenic walking trails, ponds, and Monitor lizards in Bangkok's heart.",
        geom: { type: 'Point', coordinates: [100.5567, 13.7282] }, // Silom, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Starbucks Emquartier',
        type: 'cafe',
        description:
          'Premium Starbucks location in the luxury Emquartier shopping mall with modern interior design.',
        geom: { type: 'Point', coordinates: [100.5597, 13.7381] }, // Silom, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Samsen School',
        type: 'school',
        description:
          'Historic public school providing quality education in the traditional Samsen district.',
        geom: { type: 'Point', coordinates: [100.4856, 13.7673] }, // Samsen, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Pho Hoa Noodle Soup',
        type: 'restaurant',
        description:
          'Casual Vietnamese pho restaurant offering authentic broths and traditional rice noodle soups.',
        geom: { type: 'Point', coordinates: [100.535, 13.75] }, // Pathum Wan, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Bangkok Hospital',
        type: 'hospital',
        description:
          'Leading private hospital chain providing comprehensive general medicine and specialized departments.',
        geom: { type: 'Point', coordinates: [100.5617, 13.7342] }, // Silom, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Jim Thompson House',
        type: 'attraction',
        description:
          "Museum showcasing traditional Thai silk merchant's home with artifacts and Thai architectural heritage.",
        geom: { type: 'Point', coordinates: [100.5119, 13.7558] }, // Pathum Wan, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Khlong Toei School',
        type: 'school',
        description:
          'Public educational institution serving the waterfront Khlong Toei community.',
        geom: { type: 'Point', coordinates: [100.585, 13.665] }, // Khlong Toei, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Som Tam Conti',
        type: 'restaurant',
        description:
          'Popular Thai restaurant specializing in spicy papaya salad and Northeast Thai cuisine.',
        geom: { type: 'Point', coordinates: [100.54, 13.76] }, // Ratchathewi, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Emporium Cafe',
        type: 'cafe',
        description:
          'Upscale cafe in the Emporium shopping complex with specialty coffee and light fare.',
        geom: { type: 'Point', coordinates: [100.559, 13.742] }, // Silom, Bangkok
      },
      {
        id: crypto.randomUUID(),
        name: 'Wat Arun',
        type: 'attraction',
        description:
          'Iconic Buddhist temple on the Chao Phraya River featuring distinctive porcelain-decorated spires.',
        geom: { type: 'Point', coordinates: [100.4876, 13.6442] }, // Bangkok Yai, Bangkok
      },
    ];

    await placesRepository.insert(places as any);
    console.log(`Seeded ${places.length} places`);

    await AppDataSource.destroy();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
