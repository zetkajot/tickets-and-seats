import { randomUUID } from 'crypto';
import Ticket from '../../domain/ticket';
import UseCase from '../use-case';
import tryEntityInteraction from '../use-case-utils/try-catch-shorthands/try-entity-interaction';

type Input = {
  eventId: string,
  seatNo: number,
};

type Output = {
  ticketId: string,
  seatNo: number,
  hallId: string,
  eventId: string,
  eventName: string,
  eventStartingDate: Date,
  eventEndingDate: Date,
};

export default class IssueTicket extends UseCase<Input, Output> {
  async execute({ eventId, seatNo }: Input): Promise<Output> {
    let event = await this.adaptedDataVendor.findUniqueEvent(eventId);
    event = await this.adaptedDataVendor.plugRealHall(event);
    tryEntityInteraction()(event.reserveSeat.bind(event), seatNo);
    const ticket: Ticket = {
      event,
      id: randomUUID(),
      seatNo,
    };
    await this.adaptedDataVendor.saveEvent(event);
    await this.adaptedDataVendor.saveTicket(ticket);
    return {
      eventId: event.id,
      eventName: event.name,
      eventEndingDate: event.endsAt,
      eventStartingDate: event.startsAt,
      hallId: event.hallId,
      seatNo: ticket.seatNo,
      ticketId: ticket.id,
    };
  }
}
