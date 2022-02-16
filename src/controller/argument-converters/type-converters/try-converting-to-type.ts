import ConversionError from '../conversion-error';
import { InputSchemaType } from '../types/input-schema';
import { TypeConversionResult } from '../types/type-conversion-result';
import getConverter from './get-converter';

export default function tryConvertingToType<T extends InputSchemaType>(
  type: T,
  value: string,
): TypeConversionResult<T> {
  const converter = getConverter(type);
  try {
    return {
      isOk: true,
      value: converter(value),
    };
  } catch (error) {
    return {
      isOk: false,
      error: error as ConversionError,
    };
  }
}
