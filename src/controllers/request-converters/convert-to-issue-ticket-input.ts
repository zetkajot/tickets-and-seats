import ErrorFactory from '../../error/error-factory';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

export default function convertToIssueTicketInput(request: ControllerRequest): {
  eventId: string,
  seatNo: number,
} {
  if (request.args.length < 2) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  const mappedArgs = new Map<string, any>();

  request.args.forEach(({ name, value }) => {
    if (['eventId', 'seatNo'].includes(name)) {
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
    eventId: mappedArgs.get('eventId'),
    seatNo: tryConvertingToNumber(mappedArgs.get('seatNo')),
  };
}

function tryConvertingToNumber(seatNo: string): number {
  const numSeatNo = parseInt(seatNo, 10);
  if (Number.isNaN(numSeatNo)) {
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
  return numSeatNo;
}
