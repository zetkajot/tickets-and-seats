import ErrorFactory from '../../../error/error-factory';
import StorageError from '../../../infrastracture/errors/storage-error';
import InternalError, { InternalErrorSubtype } from '../../../use-cases/use-case-utils/errors/internal-error';
import RehtrowingTemplate from './rethrowing-template';

const storageQuery: RehtrowingTemplate = {
  rehthrows: [
    {
      matchingError: StorageError,
      rehtrowingFn: makeInternalErrorFromStorageError,
    },
    {
      matchingError: Error,
      rehtrowingFn: makeUnknownInternalError,
    },
  ],
};

function makeInternalErrorFromStorageError(error: StorageError) {
  return ErrorFactory.getInstance()
    .makeError(InternalError, InternalErrorSubtype.STORAGE_ERROR, error);
}

function makeUnknownInternalError(error: Error) {
  return ErrorFactory.getInstance()
    .makeError(InternalError, InternalErrorSubtype.UNKNOWN_ERROR, error);
}

export default storageQuery;
