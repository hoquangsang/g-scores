export type ResolveDatabaseUrlOptions = {
  directUrl?: string;
  databaseUrl?: string;
  fallbackUrl?: string;
  errorMessage?: string;
};

export function resolveDatabaseUrl({
  directUrl = process.env['DIRECT_URL'],
  databaseUrl = process.env['DATABASE_URL'],
  fallbackUrl,
  errorMessage = 'DATABASE_URL or DIRECT_URL is required',
}: ResolveDatabaseUrlOptions = {}): string {
  const resolvedUrl = directUrl ?? databaseUrl ?? fallbackUrl;

  if (!resolvedUrl) {
    throw new Error(errorMessage);
  }

  return resolvedUrl;
}
