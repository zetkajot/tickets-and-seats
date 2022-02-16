import ConversionError from '../conversion-error';
import { ExtractRealTypeFromSchemaType } from './extract-real-type-from-schema-type';
import { InputSchemaType } from './input-schema';

export type TypeConversionResult<T extends InputSchemaType> = {
  isOk: true;
  value: ExtractRealTypeFromSchemaType<T>
} | {
  isOk: false;
  error: ConversionError;
};
