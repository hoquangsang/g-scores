-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT IF EXISTS "Candidate_examId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Candidate_examId_examTrack_idx";
DROP INDEX IF EXISTS "Candidate_examId_registrationNumber_key";
DROP INDEX IF EXISTS "Candidate_registrationNumber_idx";
DROP INDEX IF EXISTS "Exam_year_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "examId";

-- DropTable
DROP TABLE "Exam";

-- CreateTable
CREATE TABLE "ExamGroup" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamGroupSubject" (
    "examGroupId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "ExamGroupSubject_pkey" PRIMARY KEY ("examGroupId","subjectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_registrationNumber_key" ON "Candidate"("registrationNumber");

-- CreateIndex
CREATE INDEX "Candidate_examTrack_idx" ON "Candidate"("examTrack");

-- CreateIndex
CREATE UNIQUE INDEX "ExamGroup_code_key" ON "ExamGroup"("code");

-- CreateIndex
CREATE INDEX "ExamGroupSubject_subjectId_idx" ON "ExamGroupSubject"("subjectId");

-- AddForeignKey
ALTER TABLE "ExamGroupSubject" ADD CONSTRAINT "ExamGroupSubject_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "ExamGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGroupSubject" ADD CONSTRAINT "ExamGroupSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
