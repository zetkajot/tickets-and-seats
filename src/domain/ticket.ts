import Event from './event';

export default interface Ticket {
  id: string;

  event: Event;

  seatNo: number;
}
