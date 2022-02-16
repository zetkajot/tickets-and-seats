import ConversionError from '../conversion-error';

export type ConversionResult = SuccessfulConversion | FailedConversion;

export type SuccessfulConversion = {
  wasSuccessful: true;
  convertedData: {
    [inputParamName: string]: string | number | Date | object | undefined;
  }
};

export type FailedConversion = {
  wasSuccessful: false;
  failReasons: {
    [argumentName: string]: ConversionError;
  }
};
