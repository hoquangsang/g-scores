import type { TopGroupReport } from './api';

export const subjectLabels: Record<string, string> = {
  toan: 'Toán',
  ngu_van: 'Ngữ văn',
  ngoai_ngu: 'Ngoại ngữ',
  vat_li: 'Vật lí',
  hoa_hoc: 'Hóa học',
  sinh_hoc: 'Sinh học',
  lich_su: 'Lịch sử',
  dia_li: 'Địa lí',
  gdcd: 'GDCD',
};

export const defaultSubjects = Object.keys(subjectLabels);

export const examGroupLabels: Record<string, string> = {
  A: 'Khối A (Toán, Lí, Hóa)',
  A1: 'Khối A1 (Toán, Lí, Anh)',
  B: 'Khối B (Toán, Hóa, Sinh)',
  C: 'Khối C (Văn, Sử, Địa)',
  D: 'Khối D (Toán, Văn, Anh)',
};

export const examGroupSubjectCodes: Record<string, string[]> = {
  A: ['toan', 'vat_li', 'hoa_hoc'],
  A1: ['toan', 'vat_li', 'ngoai_ngu'],
  B: ['toan', 'hoa_hoc', 'sinh_hoc'],
  C: ['ngu_van', 'lich_su', 'dia_li'],
  D: ['toan', 'ngu_van', 'ngoai_ngu'],
};

export const examGroupCodes = Object.keys(examGroupLabels);

export const scoreGroups = [
  { label: 'Môn chung', subjects: ['toan', 'ngu_van', 'ngoai_ngu'] },
  { label: 'Tổ hợp KHTN', subjects: ['vat_li', 'hoa_hoc', 'sinh_hoc'] },
  { label: 'Tổ hợp KHXH', subjects: ['lich_su', 'dia_li', 'gdcd'] },
];

const examTrackLabels: Record<string, string> = {
  NATURAL: 'KHTN',
  SOCIAL: 'KHXH',
  UNKNOWN: 'Chưa xác định',
};

const scoreLevelLabels: Record<string, string> = {
  gte_8: 'Từ 8 điểm',
  gte_6_lt_8: 'Từ 6 đến dưới 8',
  gte_4_lt_6: 'Từ 4 đến dưới 6',
  lt_4: 'Dưới 4 điểm',
};

export function getSubjectLabel(subjectCode: string): string {
  return subjectLabels[subjectCode] ?? subjectCode;
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}

export function formatInteger(value: number): string {
  return value.toLocaleString('vi-VN');
}

export function formatExamTrack(examTrack: string): string {
  return examTrackLabels[examTrack] ?? examTrackLabels.UNKNOWN;
}

export function getScoreLevelLabel(code: string): string {
  return scoreLevelLabels[code] ?? code;
}

export function getSubjectScoreStep(subjectCode: string): number {
  return ['toan', 'ngoai_ngu'].includes(subjectCode) ? 0.2 : 0.25;
}

export function formatSubjectScore(
  candidate: TopGroupReport['items'][number],
  subjectCode: string,
): string {
  const score = candidate.scores.find((item) => item.subjectCode === subjectCode);
  return score ? formatScore(score.score) : '-';
}
