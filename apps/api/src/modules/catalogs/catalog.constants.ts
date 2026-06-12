export const SUBJECT_CODE_ORDER = [
  'toan',
  'ngu_van',
  'ngoai_ngu',
  'vat_li',
  'hoa_hoc',
  'sinh_hoc',
  'lich_su',
  'dia_li',
  'gdcd',
] as const;

export const EXAM_GROUP_SUBJECT_CODE_ORDER: Record<string, readonly string[]> = {
  A: ['toan', 'vat_li', 'hoa_hoc'],
  A1: ['toan', 'vat_li', 'ngoai_ngu'],
  B: ['toan', 'hoa_hoc', 'sinh_hoc'],
  C: ['ngu_van', 'lich_su', 'dia_li'],
  D: ['toan', 'ngu_van', 'ngoai_ngu'],
};

export function getSubjectOrderIndex(subjectCode: string): number {
  const index = SUBJECT_CODE_ORDER.indexOf(subjectCode as (typeof SUBJECT_CODE_ORDER)[number]);
  return index === -1 ? SUBJECT_CODE_ORDER.length : index;
}

export function getExamGroupSubjectOrderIndex(groupCode: string, subjectCode: string): number {
  const subjectCodes = EXAM_GROUP_SUBJECT_CODE_ORDER[groupCode.toUpperCase()];

  if (!subjectCodes) {
    return getSubjectOrderIndex(subjectCode);
  }

  const index = subjectCodes.indexOf(subjectCode);
  return index === -1 ? subjectCodes.length : index;
}
