import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const DEFAULT_API_PORT = 3000;

function getApiPort(): number {
  const port = Number(process.env.API_PORT);

  return Number.isInteger(port) && port > 0 ? port : DEFAULT_API_PORT;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  });

  await app.listen(getApiPort());
}

void bootstrap();
