import DomainError from '../../../domain/errrors/domain-error';
import ErrorFactory from '../../../error/error-factory';
import DiscrepancyError from '../../../use-cases/use-case-utils/errors/discrapency-error';
import InternalError, { InternalErrorSubtype } from '../../../use-cases/use-case-utils/errors/internal-error';
import RehtrowingTemplate from './rethrowing-template';

const reconstructingFromStorageData: RehtrowingTemplate = {
  rehthrows: [
    {
      matchingError: DomainError,
      rehtrowingFn: makeDiscrepancyError,
    },
    {
      matchingError: Error,
      rehtrowingFn: makeUnknownInternalError,
    },
  ],
};

function makeUnknownInternalError(error: Error) {
  return ErrorFactory.getInstance()
    .makeError(InternalError, InternalErrorSubtype.UNKNOWN_ERROR, error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeDiscrepancyError(error: Error) {
  return ErrorFactory.getInstance()
    .makeError(DiscrepancyError);
}

export default reconstructingFromStorageData;
