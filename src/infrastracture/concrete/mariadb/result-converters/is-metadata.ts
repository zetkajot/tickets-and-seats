import { ColumnMetadata } from '../types/result-set';

export default function isMetadata(row: any | ColumnMetadata[]): row is ColumnMetadata[] {
  return Array.isArray(row)
    && row.length > 0
    && 'collation' in row[0]
    && 'columnLength' in row[0]
    && 'columnType' in row[0]
    && 'type' in row[0]
    && 'scale' in row[0]
    && 'flags' in row[0]
    && 'db' in row[0]
    && 'schema' in row[0]
    && 'table' in row[0]
    && 'orgTable' in row[0]
    && 'name' in row[0]
    && 'orgName' in row[0];
}
