import 'reflect-metadata';

/**
 * ponytail: minimal e2e check that POST /places creates a valid Feature
 * and GET /places returns a valid FeatureCollection.
 * Run via: npm run dev (in another terminal) then npx ts-node src/demo.ts
 */
async function demo() {
  const API_URL = 'http://localhost:3000';
  console.log('Starting minimal e2e demo...\n');

  try {
    // POST: Create a place
    console.log('1. Creating a new place...');
    const createRes = await fetch(`${API_URL}/places`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Demo Cafe',
        type: 'cafe',
        geometry: { type: 'Point', coordinates: [100.53, 13.75] },
      }),
    });
    if (createRes.status !== 201) {
      throw new Error(`POST /places returned ${createRes.status}`);
    }
    const createdFeature = (await createRes.json()) as any;
    console.log(`✓ Created place with id: ${createdFeature.id}`);
    console.log(`✓ Feature type: ${createdFeature.type}`);
    console.log(`✓ Geometry type: ${createdFeature.geometry.type}`);
    console.log(`✓ Coordinates: [${createdFeature.geometry.coordinates}]`);
    console.log(`✓ Properties: ${JSON.stringify(createdFeature.properties)}\n`);

    // Validate Feature structure
    if (
      createdFeature.type !== 'Feature' ||
      createdFeature.geometry?.type !== 'Point' ||
      !Array.isArray(createdFeature.geometry?.coordinates) ||
      !createdFeature.properties?.name ||
      !createdFeature.properties?.type ||
      !createdFeature.properties?.createdAt
    ) {
      throw new Error('Invalid Feature structure');
    }

    // GET: List all places (FeatureCollection)
    console.log('2. Fetching all places...');
    const listRes = await fetch(`${API_URL}/places`);
    if (listRes.status !== 200) {
      throw new Error(`GET /places returned ${listRes.status}`);
    }
    const featureCollection = (await listRes.json()) as any;
    console.log(`✓ FeatureCollection type: ${featureCollection.type}`);
    console.log(`✓ Features count: ${featureCollection.features?.length || 0}`);
    console.log(`✓ First feature id: ${featureCollection.features?.[0]?.id || 'N/A'}\n`);

    // Validate FeatureCollection structure
    if (
      featureCollection.type !== 'FeatureCollection' ||
      !Array.isArray(featureCollection.features)
    ) {
      throw new Error('Invalid FeatureCollection structure');
    }

    // Verify our created place is in the list
    const found = featureCollection.features.find(
      (f: any) => f.id === createdFeature.id,
    );
    if (!found) {
      throw new Error('Created place not found in list');
    }
    console.log('✓ Created place found in FeatureCollection\n');

    // GET: Single place by ID
    console.log('3. Fetching single place by ID...');
    const detailRes = await fetch(`${API_URL}/places/${createdFeature.id}`);
    if (detailRes.status !== 200) {
      throw new Error(`GET /places/:id returned ${detailRes.status}`);
    }
    const detailFeature = (await detailRes.json()) as any;
    console.log(`✓ Retrieved Feature id: ${detailFeature.id}`);
    console.log(
      `✓ Name matches: ${detailFeature.properties.name === createdFeature.properties.name}`,
    );
    console.log(
      `✓ Type matches: ${detailFeature.properties.type === createdFeature.properties.type}\n`,
    );

    // DELETE: Remove the created place
    console.log('4. Deleting the created place...');
    const delRes = await fetch(`${API_URL}/places/${createdFeature.id}`, {
      method: 'DELETE',
    });
    if (delRes.status !== 204) {
      throw new Error(`DELETE /places/:id returned ${delRes.status}, expected 204`);
    }
    console.log(`✓ Place deleted successfully (204 No Content)\n`);

    // Verify deletion
    console.log('5. Verifying deletion...');
    const notFoundRes = await fetch(`${API_URL}/places/${createdFeature.id}`);
    if (notFoundRes.status !== 404) {
      throw new Error(`Expected 404 after delete, got ${notFoundRes.status}`);
    }
    console.log('✓ Place not found after deletion (404)\n');

    console.log('✓✓✓ All checks passed! ✓✓✓\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Demo failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

demo();
