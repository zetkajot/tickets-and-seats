/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import Event from '../../domain/event';
import Ticket from '../../domain/ticket';
import UseCase from '../use-case';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
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

    const ticket = this.tryIssuingTicket(event, seatNo);

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

  private tryIssuingTicket(event: Event, seatNo: number): Ticket {
    this.assureEventIsOpen(event);
    this.assureEventHasSeat(event, seatNo);
    tryEntityInteraction({
      onDomainError: 'InvalidDataError',
      errorSubtype: InvalidDataErrorSubtype.SEAT_TAKEN,
    })(event.reserveSeat.bind(event, seatNo));

    return {
      event,
      id: randomUUID(),
      seatNo,
    };
  }

  private assureEventIsOpen(event: Event): void {
    if (!event.isOpenForReservations) {
      throw new InvalidDataError(InvalidDataErrorSubtype.EVENT_CLOSED);
    }
  }

  private assureEventHasSeat(event: Event, seatNo: number): void {
    if (!event.hasSeat(seatNo)) {
      throw new InvalidDataError(InvalidDataErrorSubtype.SEAT_NOT_FOUND);
    }
  }
}
