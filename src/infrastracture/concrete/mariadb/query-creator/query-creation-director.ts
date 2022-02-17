import { BuiltQuery } from './types/built-query';
import QueryBuilder from './types/query-builder';

export default class QueryCreationDirector {
  constructor(private builder: QueryBuilder) {}

  createQuery(tableName: string, fields: Record<string, any>): BuiltQuery {
    this.builder.setTableName(tableName);
    Object.entries(fields).forEach((nameValuePair) => this.builder.setField(...nameValuePair));
    const builtQuery = this.builder.buildQuery();
    this.builder.reset();
    return builtQuery;
  }
}
