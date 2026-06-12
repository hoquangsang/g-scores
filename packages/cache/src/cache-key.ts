export type CacheKeyPart = boolean | number | string | null | undefined;

export function createCacheKey(...parts: CacheKeyPart[]): string {
  return parts
    .filter((part): part is boolean | number | string => part !== null && part !== undefined)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join(':');
}
