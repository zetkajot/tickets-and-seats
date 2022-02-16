import { BuiltQuery } from '../types/built-query';
import QueryBuilder from '../types/query-builder';

export default class DeleteQueryBuilder implements QueryBuilder {
  private parameterValues: any[] = [];

  setTableName(name: string): void {
    this.parameterValues[0] = name;
  }

  setField(name: string, value: any): void {
    this.parameterValues.push(name, value);
  }

  buildQuery(): BuiltQuery {
    return {
      query: this.buildQueryString(),
      values: this.parameterValues,
    };
  }

  private buildQueryString(): string {
    const fieldParams = this.parameterValues.slice(1);
    const whereClauseParams: string[] = [];
    fieldParams.reduce((shouldPush) => {
      if (shouldPush) whereClauseParams.push('?=?');
      return !shouldPush;
    }, false);
    const afterWhereClause = whereClauseParams.join(' AND ');
    return `DELETE FROM ?${afterWhereClause.length > 0 ? ` WHERE ${afterWhereClause}` : ''};`;
  }
}
