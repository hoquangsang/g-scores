import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createDatabaseClient, resolveDatabaseUrl } from '../src';

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

async function seedCatalogs(): Promise<void> {
  for (const subject of subjects) {
    await db.subject.upsert({
      where: { code: subject.code },
      update: { name: subject.name },
      create: subject,
    });
  }

  for (const foreignLanguage of foreignLanguages) {
    await db.foreignLanguage.upsert({
      where: { code: foreignLanguage.code },
      update: { name: foreignLanguage.name },
      create: foreignLanguage,
    });
  }

  for (const examGroupData of examGroups) {
    await db.examGroup.upsert({
      where: { code: examGroupData.code },
      update: { name: examGroupData.name },
      create: {
        code: examGroupData.code,
        name: examGroupData.name,
      },
    });
  }

  const [seededSubjects, seededExamGroups] = await Promise.all([
    db.subject.findMany({
      where: { code: { in: subjects.map((subject) => subject.code) } },
      select: { id: true, code: true },
    }),
    db.examGroup.findMany({
      where: { code: { in: examGroups.map((examGroup) => examGroup.code) } },
      select: { id: true, code: true },
    }),
  ]);

  const subjectIdsByCode = new Map(seededSubjects.map((subject) => [subject.code, subject.id]));
  const examGroupIdsByCode = new Map(
    seededExamGroups.map((examGroup) => [examGroup.code, examGroup.id]),
  );

  await db.examGroupSubject.deleteMany({
    where: {
      examGroupId: { in: seededExamGroups.map((examGroup) => examGroup.id) },
    },
  });

  await db.examGroupSubject.createMany({
    data: examGroups.flatMap((examGroup) => {
      const examGroupId = examGroupIdsByCode.get(examGroup.code);

      if (!examGroupId) {
        throw new Error(`Missing seeded exam group: ${examGroup.code}`);
      }

      return examGroup.subjects.map((subjectCode) => {
        const subjectId = subjectIdsByCode.get(subjectCode);

        if (!subjectId) {
          throw new Error(`Missing seeded subject: ${subjectCode}`);
        }

        return { examGroupId, subjectId };
      });
    }),
  });
}

async function main(): Promise<void> {
  await seedCatalogs();
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
