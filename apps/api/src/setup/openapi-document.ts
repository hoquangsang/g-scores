import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export type OpenApiDocumentOptions = {
  readonly version?: string;
  readonly serverUrl?: string;
  readonly serverName?: string;
};

export function createOpenApiDocument(
  app: INestApplication,
  { version = '0.0.0', serverUrl, serverName }: OpenApiDocumentOptions = {},
) {
  const builder = new DocumentBuilder()
    .setTitle('G-Scores API')
    .setDescription('API documentation for G-Scores')
    .setVersion(version);

  if (serverUrl) {
    builder.addServer(serverUrl, serverName);
  }

  const document = SwaggerModule.createDocument(app, builder.build());

  if (!serverUrl) {
    delete document.servers;
  }

  return document;
}
