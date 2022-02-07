import UseCase from '../use-case';
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
    tryEntityInteraction()(event.closeForReservations.bind(event));
    await this.adaptedDataVendor.saveEvent(event);

    return {
      eventId: event.id,
      eventName: event.name,
      isOpenForReservations: event.isOpenForReservations,
    };
  }
}
