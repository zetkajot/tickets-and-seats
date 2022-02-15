import convertToDate from './convert-to-date';
import convertToNumber from './convert-to-number';
import convertToObject from './convert-to-object';
import convertToString from './convert-to-string';
import { InputSchemaType } from '../types/input-schema';
import { ExtractRealTypeFromSchemaType } from '../types/extract-real-type-from-schema-type';

export default function getConverter<T extends InputSchemaType>(
  type: T,
): (value: string) => ExtractRealTypeFromSchemaType<T> {
  switch (type) {
    case InputSchemaType.DATE:
      return convertToDate as (value: string) => ExtractRealTypeFromSchemaType<T>;
    case InputSchemaType.NUMBER:
      return convertToNumber as (value: string) => ExtractRealTypeFromSchemaType<T>;
    case InputSchemaType.OBJECT:
      return convertToObject as (value: string) => ExtractRealTypeFromSchemaType<T>;
    default:
      return convertToString as (value: string) => ExtractRealTypeFromSchemaType<T>;
  }
}
