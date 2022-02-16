import { BuiltQuery } from '../types/built-query';
import QueryBuilder from '../types/query-builder';

export default class InsertQueryBuilder implements QueryBuilder {
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
      values: this.prepareValues(),
    };
  }

  private prepareQueryString(): string {
    const parenthesisedParams = this.fieldNames.map(() => '?').join(', ');
    const updateParams = this.fieldNames.map(() => '? = VALUES(?)').join(', ');
    return `INSERT INTO ? (${parenthesisedParams}) VALUES (${parenthesisedParams}) ON DUPLICATE KEY UPDATE ${updateParams};`;
  }

  private prepareValues(): any[] {
    return [
      this.tableName,
      ...this.fieldNames,
      ...this.fieldValues,
      ...this.doubleArrayEntries(this.fieldNames),
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  private doubleArrayEntries(array: any[]): any[] {
    const resultingArray = Array(array.length * 2);
    array.forEach((val, idx) => {
      resultingArray[idx * 2] = val;
      resultingArray[idx * 2 + 1] = val;
    });
    return resultingArray;
  }
}
