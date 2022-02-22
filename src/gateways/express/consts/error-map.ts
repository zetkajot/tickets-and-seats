import { InvalidDataErrorSubtype } from '../../../use-cases/use-case-utils/errors/invalid-data-error';
import { HTTPErrorCodeMap } from '../types/http-error-code-map';

const ErrorMap: HTTPErrorCodeMap = {
  'Invalid Request Error': 400,
  'Internal Error': 500,
  'Invalid Data Error': {
    [InvalidDataErrorSubtype.ENTITY_NOT_FOUND]: 404,
    [InvalidDataErrorSubtype.EVENT_CLOSED]: 409,
    [InvalidDataErrorSubtype.EVENT_OPENED]: 409,
    [InvalidDataErrorSubtype.INVALID_EVENT_DATA]: 422,
    [InvalidDataErrorSubtype.INVALID_HALL_DATA]: 422,
    [InvalidDataErrorSubtype.NOT_SPECIFIED]: 400,
    [InvalidDataErrorSubtype.SEAT_NOT_FOUND]: 409,
    [InvalidDataErrorSubtype.SEAT_TAKEN]: 409,
  },
};

export default ErrorMap;
