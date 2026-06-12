import type { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@/config';
import { createOpenApiDocument } from './openapi-document';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  if (!configService.app.enableSwagger) {
    return;
  }

  const document = createOpenApiDocument(app, {
    version: configService.app.version,
  });

  SwaggerModule.setup(`${configService.app.apiPrefix}/docs`, app, document, {
    customSiteTitle: 'G-Scores API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
