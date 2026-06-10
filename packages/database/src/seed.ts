import { createDatabaseClient, type DatabaseTransaction } from './client';

const databaseUrl = process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('DATABASE_URL or DIRECT_URL is required to seed the database');
}

const db = createDatabaseClient({
  url: databaseUrl,
});

const subjects = [
  { code: 'toan', name: 'Mathematics' },
  { code: 'ngu_van', name: 'Literature' },
  { code: 'ngoai_ngu', name: 'Foreign Language' },
  { code: 'vat_li', name: 'Physics' },
  { code: 'hoa_hoc', name: 'Chemistry' },
  { code: 'sinh_hoc', name: 'Biology' },
  { code: 'lich_su', name: 'History' },
  { code: 'dia_li', name: 'Geography' },
  { code: 'gdcd', name: 'Civic Education' },
] as const;

const foreignLanguages = [
  { code: 'N1', name: 'English' },
  { code: 'N2', name: 'Russian' },
  { code: 'N3', name: 'French' },
  { code: 'N4', name: 'Chinese' },
  { code: 'N5', name: 'German' },
  { code: 'N6', name: 'Japanese' },
  { code: 'N7', name: 'Korean' },
] as const;

async function seedCatalogs(tx: DatabaseTransaction): Promise<void> {
  await tx.exam.upsert({
    where: { year: 2024 },
    update: { name: 'THPT 2024' },
    create: { year: 2024, name: 'THPT 2024' },
  });

  for (const subject of subjects) {
    await tx.subject.upsert({
      where: { code: subject.code },
      update: { name: subject.name },
      create: subject,
    });
  }

  for (const foreignLanguage of foreignLanguages) {
    await tx.foreignLanguage.upsert({
      where: { code: foreignLanguage.code },
      update: { name: foreignLanguage.name },
      create: foreignLanguage,
    });
  }
}

async function main(): Promise<void> {
  await db.$transaction(async (tx) => {
    await seedCatalogs(tx);
  });
}

main()
  .then(async () => {
    console.log('Seed completed');
    await db.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error('Seed failed');
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
