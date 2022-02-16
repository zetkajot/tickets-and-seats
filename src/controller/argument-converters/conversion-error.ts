export default class ConversionError extends Error {
  constructor(public readonly subtype: ConversionErrorSubtype) {
    super();
    this.name = 'Conversion Error';
    this.message = conversionErrorMessages[subtype];
  }
}

export enum ConversionErrorSubtype {
  MISSING_PARAMETER,
  DUPLICATE_PARAMETER,
  NOT_A_STRING,
  NOT_A_NUMBER,
  NOT_A_DATE,
  NOT_AN_OBJECT,
}

const conversionErrorMessages: { [k in ConversionErrorSubtype]: string } = {
  [ConversionErrorSubtype.MISSING_PARAMETER]: 'Required parameter is missing!',
  [ConversionErrorSubtype.DUPLICATE_PARAMETER]: 'Parameter is duplicated!',
  [ConversionErrorSubtype.NOT_A_STRING]: 'Parameter\'s value is not a valid string!',
  [ConversionErrorSubtype.NOT_A_DATE]: 'Parameter\'s value is not a valid date!',
  [ConversionErrorSubtype.NOT_A_NUMBER]: 'Parameter\'s value is not a valid number!',
  [ConversionErrorSubtype.NOT_AN_OBJECT]: 'Parameter\'s value is not a valid object!',
};
