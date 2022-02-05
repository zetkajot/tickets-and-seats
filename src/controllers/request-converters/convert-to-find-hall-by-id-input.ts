import ErrorFactory from '../../error/error-factory';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

export default function convertToFindHallByIdInput(request: ControllerRequest): { hallId: string } {
  if (request.args.length < 1) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  const matchingArgs = request.args.filter((arg) => arg.name === 'id');

  if (matchingArgs.length !== 1) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  return {
    hallId: matchingArgs[0].value,
  };
}
