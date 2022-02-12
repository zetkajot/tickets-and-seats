import ErrorFactory from '../../../error/error-factory';
import DiscrepancyError from '../../../use-cases/use-case-utils/errors/discrapency-error';
import InvalidDataError from '../../../use-cases/use-case-utils/errors/invalid-data-error';
import RehtrowingTemplate from './rethrowing-template';

const findRelatedEntity: RehtrowingTemplate = {
  rehthrows: [
    {
      matchingError: InvalidDataError,
      rehtrowingFn: (error) => ErrorFactory.getInstance().makeError(DiscrepancyError, error),
    },
  ],
};

export default findRelatedEntity;
