import { randomUUID } from 'crypto';
import Event from '../../domain/event';
import Hall from '../../domain/hall';
import Ticket from '../../domain/ticket';
import UseCase from '../use-case';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';
import tryEntityInteraction from '../use-case-utils/try-catch-shorthands/try-entity-interaction';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';

type Input = {
  eventId: string,
  seatNo: number,
};

type Output = {
  ticketId: string,
  seatNo: number,
  hallName: string,
  eventId: string,
  eventName: string,
  eventStartingDate: Date,
  eventEndingDate: Date,
};

export default class IssueTicket extends UseCase<Input, Output> {
  async execute({ eventId, seatNo }: Input): Promise<Output> {
    let event = await this.adaptedDataVendor.findUniqueEvent(eventId);
    const hall = await this.adaptedDataVendor.findUniqueRelatedHall(event.hallId);
    event = this.plugHallToEvent(hall, event);
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
      hallName: hall.name,
      seatNo: ticket.seatNo,
      ticketId: ticket.id,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private plugHallToEvent(hall: Hall, event: Event): Event {
    const eventData = deconstructEvent(event);
    return tryReconstructing(reconstructEvent, eventData, hall);
  }
}
