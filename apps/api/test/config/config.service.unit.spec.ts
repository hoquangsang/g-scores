import { describe, expect, it } from '@jest/globals';

import { ConfigService } from '@/config';

describe(ConfigService.name, () => {
  it('exposes app and database config', () => {
    const service = new ConfigService();

    expect(service.app.apiPrefix).toBeTruthy();
    expect(service.app.apiVersion).toBeTruthy();
    expect(service.cache.driver).toBeTruthy();
    expect(service.cache.ttlSeconds).toBeGreaterThan(0);
    expect(service.db.url).toBeTruthy();
  });

  it('exposes runtime environment helpers', () => {
    const service = new ConfigService();

    expect(typeof service.isDevelopment).toBe('boolean');
    expect(typeof service.isProduction).toBe('boolean');
  });
});
