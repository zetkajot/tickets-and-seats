import { JSONParserSchema } from './types/json-parser-schema';

export function inValues(valuesArray: Array<any>): (targetValue: any) => boolean {
  return (targetValue: any) => valuesArray.includes(targetValue);
}
export function exactValue(value: any): (targetValue: any) => boolean {
  return (targetValue: any) => targetValue === value;
}

export function array(nestedSchema: JSONParserSchema): (value: any) => [JSONParserSchema, any[]] {
  return (value: any) => [nestedSchema, value];
}
