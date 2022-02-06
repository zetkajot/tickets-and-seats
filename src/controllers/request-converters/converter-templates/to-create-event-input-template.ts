import ErrorFactory from '../../../error/error-factory';
import InvalidRequestError from '../../errors/invalid-request-error';
import { ConverterFactorySettings } from '../make-input-converter';

const toCreateEventInputTemplate: ConverterFactorySettings = [
  'name',
  'hallId',
  {
    argumentName: 'startingDate',
    valueConverter: getDateFromString,
  },
  {
    argumentName: 'endingDate',
    valueConverter: getDateFromString,
  },
];

function getDateFromString(val: string): Date {
  const convertedDate = new Date(val);
  if (!val) {
    ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
  return convertedDate;
}

export default toCreateEventInputTemplate;
