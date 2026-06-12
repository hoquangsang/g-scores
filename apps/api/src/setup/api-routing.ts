import { type INestApplication, RequestMethod, VersioningType } from '@nestjs/common';

export type ApiRoutingOptions = {
  readonly app: INestApplication;
  readonly apiPrefix: string;
  readonly defaultVersion: string;
  readonly enableVersioning?: boolean;
};

export function setupApiRouting({
  app,
  apiPrefix,
  defaultVersion,
  enableVersioning = true,
}: ApiRoutingOptions): void {
  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      {
        path: 'health',
        method: RequestMethod.ALL,
      },
    ],
  });

  if (!enableVersioning) {
    return;
  }

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion,
  });
}
