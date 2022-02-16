import ConversionError, { ConversionErrorSubtype } from '../conversion-error';

export default function convertToObject(value: string): object {
  try {
    return JSON.parse(value);
  } catch {
    throw new ConversionError(ConversionErrorSubtype.NOT_AN_OBJECT);
  }
}
