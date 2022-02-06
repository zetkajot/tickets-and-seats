import ErrorFactory from '../../../error/error-factory';
import InvalidRequestError from '../../errors/invalid-request-error';
import { ConverterFactorySettings } from '../make-input-converter';

const toCreateHallInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'name',
    desiredName: 'hallName',
  },
  {
    argumentName: 'layout',
    desiredName: 'seatLayout',
    valueConverter: tryParsingLayout,
  },
];

function tryParsingLayout(layout: string): object {
  try {
    return JSON.parse(layout);
  } catch {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
}

export default toCreateHallInputTemplate;
