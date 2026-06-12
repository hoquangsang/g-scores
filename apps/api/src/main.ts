import 'reflect-metadata';

import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';
import { ConfigService } from './config';
import { setupApiRouting, setupSwagger } from './setup';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { app: appConfig } = configService;

  app.enableCors({
    origin: appConfig.corsOrigins,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  setupApiRouting({
    app,
    apiPrefix: appConfig.apiPrefix,
    defaultVersion: appConfig.apiVersion,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app);

  await app.listen(appConfig.port);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
