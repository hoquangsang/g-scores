import { RequestMethod, VersioningType, type INestApplication } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';

import { setupApiRouting } from '@/setup';

describe(setupApiRouting.name, () => {
  it('sets API prefix and URI versioning', () => {
    const app = createAppMock();

    setupApiRouting({
      app,
      apiPrefix: 'api',
      defaultVersion: '1',
    });

    expect(app.setGlobalPrefix).toHaveBeenCalledWith('api', {
      exclude: [{ path: 'health', method: RequestMethod.ALL }],
    });
    expect(app.enableVersioning).toHaveBeenCalledWith({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
  });

  it('can skip versioning setup', () => {
    const app = createAppMock();

    setupApiRouting({
      app,
      apiPrefix: 'api',
      defaultVersion: '1',
      enableVersioning: false,
    });

    expect(app.setGlobalPrefix).toHaveBeenCalled();
    expect(app.enableVersioning).not.toHaveBeenCalled();
  });
});

function createAppMock(): INestApplication {
  return {
    setGlobalPrefix: jest.fn(),
    enableVersioning: jest.fn(),
  } as unknown as INestApplication;
}
