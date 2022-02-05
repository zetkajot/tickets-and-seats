import DomainError from '../../../domain/errrors/domain-error';
import ErrorFactory from '../../../error/error-factory';
import InternalError, { InternalErrorSubtype } from '../../../use-cases/use-case-utils/errors/internal-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../../../use-cases/use-case-utils/errors/invalid-data-error';
import RehtrowingTemplate from './rethrowing-template';

const reconstructingFromUserData: RehtrowingTemplate = {
  rehthrows: [
    {
      matchingError: DomainError,
      rehtrowingFn: makeInvalidDataErrorFromDomainError,
    },
    {
      matchingError: Error,
      rehtrowingFn: makeUnknownInternalError,
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeInvalidDataErrorFromDomainError(error: Error) {
  return ErrorFactory.getInstance()
    .makeError(InvalidDataError, InvalidDataErrorSubtype.NOT_SPECIFIED);
}

function makeUnknownInternalError(error: Error) {
  return ErrorFactory.getInstance()
    .makeError(InternalError, InternalErrorSubtype.UNKNOWN_ERROR, error);
}

export default reconstructingFromUserData;
