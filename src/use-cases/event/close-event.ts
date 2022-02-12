import UseCase from '../use-case';
import { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import tryEntityInteraction from '../use-case-utils/try-catch-shorthands/try-entity-interaction';

type Input = {
  eventId: string;
};

type Output = {
  eventId: string,
  eventName: string,
  isOpenForReservations: boolean,
};

export default class CloseEvent extends UseCase<Input, Output> {
  async execute({ eventId }: Input): Promise<Output> {
    const event = await this.adaptedDataVendor.findUniqueEvent(eventId);
    tryEntityInteraction({
      onDomainError: 'InvalidDataError',
      errorSubtype: InvalidDataErrorSubtype.EVENT_CLOSED,
    })(event.closeForReservations.bind(event));
    await this.adaptedDataVendor.saveEvent(event);

    return {
      eventId: event.id,
      eventName: event.name,
      isOpenForReservations: event.isOpenForReservations,
    };
  }
}
