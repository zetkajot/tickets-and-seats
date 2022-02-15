import ConversionError, { ConversionErrorSubtype } from '../conversion-error';

export default function convertToNumber(value: string): number {
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new ConversionError(ConversionErrorSubtype.NOT_A_NUMBER);
  }
  return parsedValue;
}
