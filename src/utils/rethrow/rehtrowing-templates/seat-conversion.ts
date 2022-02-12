import DomainError from '../../../domain/errrors/domain-error';
import ErrorFactory from '../../../error/error-factory';
import InternalError, { InternalErrorSubtype } from '../../../use-cases/use-case-utils/errors/internal-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../../../use-cases/use-case-utils/errors/invalid-data-error';
import RehtrowingTemplate from './rethrowing-template';

const seatConversion: RehtrowingTemplate = {
  rehthrows: [
    {
      matchingError: DomainError,
      rehtrowingFn: () => ErrorFactory
        .getInstance()
        .makeError(InvalidDataError, InvalidDataErrorSubtype.INVALID_HALL_DATA),
    },
    {
      matchingError: Error,
      rehtrowingFn: (error) => ErrorFactory
        .getInstance()
        .makeError(InternalError, InternalErrorSubtype.UNKNOWN_ERROR, error),
    },
  ],
};

export default seatConversion;
