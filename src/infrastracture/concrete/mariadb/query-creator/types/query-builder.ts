import { BuiltQuery } from './built-query';

export default interface QueryBuilder {
  setTableName(name: string): void;
  setField(name: string, value: any): void;
  buildQuery(): BuiltQuery;
}
