import { BuiltQuery } from '../types/built-query';
import QueryBuilder from '../types/query-builder';

export default class InsertQueryBuilder implements QueryBuilder {
  reset(): void {
    this.tableName = '';
    this.fieldNames = [];
    this.fieldValues = [];
  }

  private tableName = '';

  private fieldNames: string[] = [];

  private fieldValues: any[] = [];

  setTableName(name: string): void {
    this.tableName = name;
  }

  setField(name: string, value: any): void {
    this.fieldNames.push(name);
    this.fieldValues.push(value);
  }

  buildQuery(): BuiltQuery {
    if (this.fieldNames.length < 1) {
      throw new Error('INSERT query requires at least one field set!');
    }
    return {
      query: this.prepareQueryString(),
      values: this.fieldValues,
    };
  }

  private prepareQueryString(): string {
    const names = this.fieldNames.map((name) => name).join(', ');
    const values = this.fieldNames.map(() => '?').join(', ');
    const updateParams = this.fieldNames.map((name) => `${name} = VALUES(${name})`).join(', ');
    return `INSERT INTO ${this.tableName} (${names}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updateParams};`;
  }
}
