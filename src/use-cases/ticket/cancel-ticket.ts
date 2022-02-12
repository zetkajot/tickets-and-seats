import UseCase from '../use-case';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import tryEntityInteraction from '../use-case-utils/try-catch-shorthands/try-entity-interaction';

type Input = {
  ticketId: string
};

type Output = {
  ticketId: string,
  eventId: string,
  seatNo: number,
};

export default class CancelTicket extends UseCase<Input, Output> {
  async execute({ ticketId }: Input): Promise<Output> {
    const deficientTargetTicket = await this.adaptedDataVendor.findUniqueTicket(ticketId);
    const targetTicket = await this.adaptedDataVendor.plugRealEvent(deficientTargetTicket);

    const relatedEvent = targetTicket.event;

    if (!relatedEvent.isOpenForReservations) {
      throw new InvalidDataError(InvalidDataErrorSubtype.EVENT_CLOSED);
    }

    tryEntityInteraction({
      onDomainError: 'DiscrepancyError',
    })(relatedEvent.unreserveSeat.bind(relatedEvent), targetTicket.seatNo);

    await this.adaptedDataVendor.deleteTicket(targetTicket);
    await this.adaptedDataVendor.saveEvent(relatedEvent);

    return {
      eventId: targetTicket.event.id,
      ticketId: targetTicket.id,
      seatNo: targetTicket.seatNo,
    };
  }
}
