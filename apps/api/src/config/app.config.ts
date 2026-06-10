import { env } from './env';

function parseCorsOrigins(): boolean | string[] {
  const origins = env.API_CORS_ORIGINS.trim();

  if (origins === '*') {
    return true;
  }

  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const appConfig = Object.freeze({
  nodeEnv: env.NODE_ENV,
  port: env.API_PORT,
  corsOrigins: parseCorsOrigins(),
});

export type AppConfig = typeof appConfig;
