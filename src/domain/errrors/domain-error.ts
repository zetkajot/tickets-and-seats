export enum DomainErrorSubtype {
  EVENT_INVALID_DATE = 1101,
  EVENT_CLOSED,
  EVENT_CLOSED_TWICE,
  EVENT_OPENED_TWICE,
  EVENT_SEAT_RESERVED,
  EVENT_SEAT_NOT_RESERVED,
  EVENT_UNKNOWN_SEAT,

  BROKER_SEAT_RESERVED = 1201,
  BROKER_SEAT_NOT_RESERVED,
  BROKER_CLOSED_EVENT,
  BROKER_UNKNOWN_TICKET,
  BROKER_UNKNOWN_SEAT,

  LAYOUT_NON_UNIQUE_NUMBERS = 1301,
  LAYOUT_UNKNOWN_SEAT,
}

const ERROR_MESSAGES: {
  [key in DomainErrorSubtype]: string;
} = {
  [DomainErrorSubtype.EVENT_INVALID_DATE]: 'Ending date must be after starting date',
  [DomainErrorSubtype.EVENT_CLOSED]: 'Cannot (un)reserve seats when event is closed',
  [DomainErrorSubtype.EVENT_CLOSED_TWICE]: 'Cannot close already closed event',
  [DomainErrorSubtype.EVENT_OPENED_TWICE]: 'Cannot open already opened event',
  [DomainErrorSubtype.EVENT_SEAT_RESERVED]: 'Cannot reserve already reserved seat',
  [DomainErrorSubtype.EVENT_SEAT_NOT_RESERVED]: 'Cannot unreserve already unreserved seat',
  [DomainErrorSubtype.EVENT_UNKNOWN_SEAT]: 'Seat does not exist',
  [DomainErrorSubtype.BROKER_SEAT_RESERVED]: 'Cannot issue ticket for already reserved seat',
  [DomainErrorSubtype.BROKER_SEAT_NOT_RESERVED]: 'Cannot cancel ticket for already unreserved seat',
  [DomainErrorSubtype.BROKER_CLOSED_EVENT]: 'Cannot issue or cancel tickets for closed event',
  [DomainErrorSubtype.BROKER_UNKNOWN_TICKET]: 'Ticket does not exists',
  [DomainErrorSubtype.BROKER_UNKNOWN_SEAT]: 'Cannot issue tickets for seat which does not exist',
  [DomainErrorSubtype.LAYOUT_NON_UNIQUE_NUMBERS]: 'Seat numbers in layout must be unique',
  [DomainErrorSubtype.LAYOUT_UNKNOWN_SEAT]: 'Seat does not exist in this layout',
};

export default class DomainError extends Error {
  constructor(public readonly subtype: DomainErrorSubtype) {
    super();
    this.name = 'Domain Error';
    this.message = ERROR_MESSAGES[subtype];
  }
}
