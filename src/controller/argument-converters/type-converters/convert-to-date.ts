import ConversionError, { ConversionErrorSubtype } from '../conversion-error';

export default function convertToDate(value: string): Date {
  const timeValue = Date.parse(value);
  if (Number.isNaN(timeValue)) {
    throw new ConversionError(ConversionErrorSubtype.NOT_A_DATE);
  }
  return new Date(timeValue);
}
