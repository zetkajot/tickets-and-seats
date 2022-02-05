import ErrorFactory from '../../error/error-factory';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

export default function convertToCreateEventInput(request: ControllerRequest): {
  eventName: string,
  hallId: string,
  eventStartingDate: Date,
  eventEndingDate: Date,
} {
  if (request.args.length < 4) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  const mappedArgs = new Map<string, any>();

  request.args.forEach(({ name, value }) => {
    if (['name', 'hallId', 'startingDate', 'endingDate'].includes(name)) {
      if (mappedArgs.has(name)) {
        throw ErrorFactory.getInstance().makeError(InvalidRequestError);
      }
      mappedArgs.set(name, value);
    }
  });

  if (mappedArgs.size !== 4) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  const [eventName, hallId] = [mappedArgs.get('name'), mappedArgs.get('hallId')];
  const [eventStartingDate, eventEndingDate] = [
    new Date(mappedArgs.get('startingDate')),
    new Date(mappedArgs.get('endingDate')),
  ];

  if (eventStartingDate === null || eventEndingDate === null) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  return {
    eventName,
    hallId,
    eventStartingDate,
    eventEndingDate,
  };
}
