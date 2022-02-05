export default class InvalidDataError extends Error {
  constructor(public readonly subtype: InvalidDataErrorSubtype) {
    super();
    this.name = 'Invalid Data Error';
    this.message = invalidDataErrorMessages[subtype];
  }
}

export enum InvalidDataErrorSubtype {
  ENTITY_NOT_FOUND = 3101,
  INVALID_SEAT_LAYOUT,
  NOT_SPECIFIED,
}

const invalidDataErrorMessages: {
  [key in InvalidDataErrorSubtype]: string
} = {
  [InvalidDataErrorSubtype.ENTITY_NOT_FOUND]: 'Entity you were looking for was not found!',
  [InvalidDataErrorSubtype.INVALID_SEAT_LAYOUT]: 'Seat layout you provided is invalid!',
  [InvalidDataErrorSubtype.NOT_SPECIFIED]: 'Cause not specified!',
};
