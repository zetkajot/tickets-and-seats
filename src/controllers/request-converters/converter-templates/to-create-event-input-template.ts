import ErrorFactory from '../../../error/error-factory';
import InvalidRequestError from '../../errors/invalid-request-error';
import { ConverterFactorySettings } from '../make-input-converter';

const toCreateEventInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'name',
    desiredName: 'eventName',
  },
  'hallId',
  {
    argumentName: 'startingDate',
    valueConverter: getDateFromString,
    desiredName: 'eventStartingDate',
  },
  {
    argumentName: 'endingDate',
    valueConverter: getDateFromString,
    desiredName: 'eventEndingDate',
  },
];

function getDateFromString(val: string): Date {
  const convertedTime = Date.parse(val);
  if (Number.isNaN(convertedTime)) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
  return new Date(convertedTime);
}

export default toCreateEventInputTemplate;
