-- CreateEnum
CREATE TYPE "ExamTrack" AS ENUM ('NATURAL', 'SOCIAL', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "examTrack" "ExamTrack" NOT NULL DEFAULT 'UNKNOWN',
    "foreignLanguageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateScore" (
    "candidateId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "score" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "CandidateScore_pkey" PRIMARY KEY ("candidateId","subjectId")
);

-- CreateTable
CREATE TABLE "ForeignLanguage" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForeignLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_year_key" ON "Exam"("year");

-- CreateIndex
CREATE INDEX "Candidate_examId_examTrack_idx" ON "Candidate"("examId", "examTrack");

-- CreateIndex
CREATE INDEX "Candidate_registrationNumber_idx" ON "Candidate"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_examId_registrationNumber_key" ON "Candidate"("examId", "registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX "CandidateScore_subjectId_score_idx" ON "CandidateScore"("subjectId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "ForeignLanguage_code_key" ON "ForeignLanguage"("code");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_foreignLanguageId_fkey" FOREIGN KEY ("foreignLanguageId") REFERENCES "ForeignLanguage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateScore" ADD CONSTRAINT "CandidateScore_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateScore" ADD CONSTRAINT "CandidateScore_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
