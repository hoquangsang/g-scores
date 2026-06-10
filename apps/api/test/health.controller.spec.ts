import { describe, expect, it } from '@jest/globals';
import { HealthController } from '../src/health/health.controller';

describe(HealthController.name, () => {
  it('returns the API health payload', () => {
    const controller = new HealthController();

    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('g-scores-api');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });
});
