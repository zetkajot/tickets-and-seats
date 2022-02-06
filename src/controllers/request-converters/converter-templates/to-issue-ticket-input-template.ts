import ErrorFactory from '../../../error/error-factory';
import InvalidRequestError from '../../errors/invalid-request-error';
import { ConverterFactorySettings } from '../make-input-converter';

const toIssueTicketInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'eventId',
  },
  {
    argumentName: 'seatNo',
    valueConverter: numberFromString,
  },
];

export default toIssueTicketInputTemplate;

function numberFromString(val: string): number {
  const numericValue = Number.parseInt(val, 10);
  if (Number.isNaN(numericValue)) {
    ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
  return numericValue;
}
