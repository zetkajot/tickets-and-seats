export default class InvalidDataError extends Error {
  constructor(public readonly subtype: InvalidDataErrorSubtype) {
    super();
    this.name = 'Invalid Data Error';
    this.message = invalidDataErrorMessages[subtype];
  }
}

export enum InvalidDataErrorSubtype {
  ENTITY_NOT_FOUND = 3101,
  EVENT_CLOSED,
  EVENT_OPENED,
  SEAT_TAKEN,
  SEAT_NOT_FOUND,
  INVALID_HALL_DATA,
  INVALID_EVENT_DATA,
  NOT_SPECIFIED,
}

const invalidDataErrorMessages: {
  [key in InvalidDataErrorSubtype]: string
} = {
  [InvalidDataErrorSubtype.ENTITY_NOT_FOUND]: 'Entity you were looking for was not found!',
  [InvalidDataErrorSubtype.INVALID_HALL_DATA]: 'Hall data you provided is invalid!',
  [InvalidDataErrorSubtype.EVENT_CLOSED]: 'Event you are trying to interact with is closed for reservations!',
  [InvalidDataErrorSubtype.EVENT_OPENED]: 'Event you are trying to interact with is open for reservations!',
  [InvalidDataErrorSubtype.INVALID_EVENT_DATA]: 'Event data you provided is invalid!',
  [InvalidDataErrorSubtype.SEAT_TAKEN]: 'Seat is already taken!',
  [InvalidDataErrorSubtype.SEAT_NOT_FOUND]: 'Seat does not exist!',
  [InvalidDataErrorSubtype.NOT_SPECIFIED]: 'Cause not specified!',
};
