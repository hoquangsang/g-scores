export type CatalogSubject = {
  readonly code: string;
  readonly name: string;
};

export type CatalogExamGroup = {
  readonly code: string;
  readonly name: string;
  readonly subjects: CatalogSubject[];
};
