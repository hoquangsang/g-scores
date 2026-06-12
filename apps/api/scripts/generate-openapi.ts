import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const openApiJsonPath = resolve(process.cwd(), 'generated/openapi/schema.json');

async function main(): Promise<void> {
  process.env.DATABASE_URL ||= 'postgresql://postgres:postgres@localhost:5432/g_scores';
  process.env.API_ENABLE_SWAGGER ||= 'true';

  const [appModule, configModule, setupModule] = await Promise.all([
    import('../dist/app.module.js'),
    import('../dist/config/index.js'),
    import('../dist/setup/index.js'),
  ]);
  const { AppModule } = getModuleExports<typeof import('../src/app.module')>(appModule);
  const { ConfigService } = getModuleExports<typeof import('../src/config')>(configModule);
  const { createOpenApiDocument, setupApiRouting } =
    getModuleExports<typeof import('../src/setup')>(setupModule);

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  try {
    const configService = app.get(ConfigService);

    setupApiRouting({
      app,
      apiPrefix: configService.app.apiPrefix,
      defaultVersion: configService.app.apiVersion,
    });

    const document = createOpenApiDocument(app, {
      version: configService.app.version,
    });

    await mkdir(dirname(openApiJsonPath), {
      recursive: true,
    });
    await writeFile(openApiJsonPath, `${JSON.stringify(document, null, 2)}\n`);
  } finally {
    await app.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

function getModuleExports<TModule>(module: TModule | { default: TModule }): TModule {
  if (typeof module === 'object' && module !== null && 'default' in module) {
    return module.default;
  }

  return module;
}
