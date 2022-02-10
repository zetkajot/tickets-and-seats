export type ColumnMetadata = {
  collation: object;
  columnLength: number,
  columnType: string,
  type: number,
  scale: number,
  flags: number,
  db: () => string,
  schema: () => string,
  table: () => string,
  orgTable: () => string,
  name: () => string,
  orgName: () => string,
};

export type ResultSet<T> = (T | ColumnMetadata[])[];
