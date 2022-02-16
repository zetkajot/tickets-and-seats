import { InvalidDataErrorSubtype } from '../../../use-cases/use-case-utils/errors/invalid-data-error';

export default function getStatusCodeFromError(error: Error): number {
  const matchingValue = errorCodeLookupTable[error.name as keyof typeof errorCodeLookupTable];
  if (!matchingValue) return 500;
  if (typeof matchingValue === 'number') return matchingValue;
  return matchingValue[(error as any).subtype as keyof typeof matchingValue];
}

const errorCodeLookupTable = {
  'Invalid Request Error': 400,
  'Internal Error': 500,
  'Invalid Data Error': {
    [InvalidDataErrorSubtype.ENTITY_NOT_FOUND]: 404,
    [InvalidDataErrorSubtype.INVALID_EVENT_DATA]: 422,
    [InvalidDataErrorSubtype.INVALID_HALL_DATA]: 422,
    [InvalidDataErrorSubtype.EVENT_CLOSED]: 409,
    [InvalidDataErrorSubtype.EVENT_OPENED]: 409,
    [InvalidDataErrorSubtype.SEAT_NOT_FOUND]: 409,
    [InvalidDataErrorSubtype.SEAT_TAKEN]: 409,
    [InvalidDataErrorSubtype.NOT_SPECIFIED]: 400,
  },
  Error: 500,
};
