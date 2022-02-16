import alternateTables from '../../../../../utils/alternate-tables';
import { BuiltQuery } from '../types/built-query';
import QueryBuilder from '../types/query-builder';

export default class DeleteQueryBuilder implements QueryBuilder {
  reset(): void {
    this.tableName = '';
    this.fieldNames = [];
    this.fieldValues = [];
  }

  private fieldNames: string[] = [];

  private fieldValues: string[] = [];

  private tableName: string = '';

  setTableName(name: string): void {
    this.tableName = name;
  }

  setField(name: string, value: any): void {
    this.fieldNames.push(name);
    this.fieldValues.push(value);
  }

  buildQuery(): BuiltQuery {
    return {
      query: this.prepareQueryString(),
      values: this.prepareValues(),
    };
  }

  private prepareQueryString(): string {
    const hasConditions = this.fieldNames.length > 0;
    return `DELETE FROM ?${hasConditions ? ` WHERE ${this.fieldNames.map(() => '?=?').join(' AND ')}` : ''};`;
  }

  private prepareValues(): any[] {
    return [
      this.tableName,
      ...alternateTables(this.fieldNames, this.fieldValues),
    ];
  }
}
