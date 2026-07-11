import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'development' ? ['debug', 'error', 'log', 'warn'] : ['error', 'warn'],
  });

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Mini Spatial Data Platform')
    .setDescription(
      'REST API for spatial data management with PostGIS.\n\n' +
      '**Standards:**\n' +
      '- [GeoJSON (RFC 7946)](https://geojson.org)\n' +
      '- [Swagger/OpenAPI 3.0](https://swagger.io/specification)\n' +
      '- [OGC API - Features](https://docs.ogc.org/is/17-069r4/17-069r4.html) — partial conformance via `/conformance`, `/collections`, `/collections/{id}/items`',
    )
    .setVersion('1.0.0')
    .addTag('places', 'CRUD for spatial places (GeoJSON Features)')
    .addTag('ogc', 'OGC API - Features compliant endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Scalar API docs (modern alternative to Swagger UI)
  app.use('/api-doc', apiReference({
    content: document,
  }));

  // Export OpenAPI JSON
  const openapiPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(openapiPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI spec exported to ${openapiPath}`);

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
  console.log(`Scalar docs available at http://localhost:${port}/api-doc`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
