import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createDatabaseClient, resolveDatabaseUrl, type DatabaseTransaction } from '../src';

loadEnv({ path: resolve(process.cwd(), '../../apps/api/.env') });

const db = createDatabaseClient({
  url: resolveDatabaseUrl({
    errorMessage: 'DATABASE_URL or DIRECT_URL is required to seed the database',
  }),
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

const examGroups = [
  { code: 'A', name: 'Group A', subjects: ['toan', 'vat_li', 'hoa_hoc'] },
  { code: 'A1', name: 'Group A1', subjects: ['toan', 'vat_li', 'ngoai_ngu'] },
  { code: 'B', name: 'Group B', subjects: ['toan', 'hoa_hoc', 'sinh_hoc'] },
  { code: 'C', name: 'Group C', subjects: ['ngu_van', 'lich_su', 'dia_li'] },
  { code: 'D', name: 'Group D', subjects: ['toan', 'ngu_van', 'ngoai_ngu'] },
] as const;

async function seedCatalogs(tx: DatabaseTransaction): Promise<void> {
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

  for (const examGroupData of examGroups) {
    const examGroup = await tx.examGroup.upsert({
      where: { code: examGroupData.code },
      update: { name: examGroupData.name },
      create: {
        code: examGroupData.code,
        name: examGroupData.name,
      },
    });

    await tx.examGroupSubject.deleteMany({
      where: { examGroupId: examGroup.id },
    });

    for (const subjectCode of examGroupData.subjects) {
      const subject = await tx.subject.findUniqueOrThrow({
        where: { code: subjectCode },
      });

      await tx.examGroupSubject.create({
        data: {
          examGroupId: examGroup.id,
          subjectId: subject.id,
        },
      });
    }
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
