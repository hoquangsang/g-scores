import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const DEFAULT_API_PORT = 3000;
const DEFAULT_CORS_ORIGINS = ['http://localhost:3001'];

function getApiPort(): number {
  const port = Number(process.env.PORT ?? process.env.API_PORT);

  return Number.isInteger(port) && port > 0 ? port : DEFAULT_API_PORT;
}

function getCorsOrigins(): boolean | string[] {
  const origins = process.env.API_CORS_ORIGINS;

  if (!origins) {
    return DEFAULT_CORS_ORIGINS;
  }

  if (origins.trim() === '*') {
    return true;
  }

  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getCorsOrigins(),
  });

  await app.listen(getApiPort());
}

void bootstrap();
