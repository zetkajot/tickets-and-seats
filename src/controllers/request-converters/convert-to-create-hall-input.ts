import ErrorFactory from '../../error/error-factory';
import { ReadableSeatLayout } from '../../utils/readable-seat-layout';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

export default function convertToCreateHallInput(request: ControllerRequest): {
  hallName: string,
  seatLayout: ReadableSeatLayout,
} {
  if (request.args.length < 2) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  const mappedArgs = new Map<string, any>();

  request.args.forEach(({ name, value }) => {
    if (['name', 'layout'].includes(name)) {
      if (mappedArgs.has(name)) {
        throw ErrorFactory.getInstance().makeError(InvalidRequestError);
      }
      mappedArgs.set(name, value);
    }
  });

  if (mappedArgs.size !== 2) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  return {
    hallName: mappedArgs.get('name'),
    seatLayout: tryParsingLayout(mappedArgs.get('layout')) as ReadableSeatLayout,
  };
}

function tryParsingLayout(layout: string): object {
  try {
    return JSON.parse(layout);
  } catch {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
}
