import { randomUUID } from 'crypto';
import Event from '../../domain/event';
import UseCase from '../use-case';
import { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import tryInstantiating from '../use-case-utils/try-catch-shorthands/try-instantiating';

type Input = {
  eventName: string,
  hallId: string,
  eventStartingDate: Date,
  eventEndingDate: Date,
};

type Output = {
  eventId: string,
  eventName: string,
};

export default class CreateEvent extends UseCase<Input, Output> {
  async execute({
    eventName, hallId, eventStartingDate, eventEndingDate,
  }: Input): Promise<Output> {
    const hall = await this.adaptedDataVendor.findUniqueHall(hallId);
    const event = <Event> tryInstantiating({
      possibleError: InvalidDataErrorSubtype.INVALID_EVENT_DATA,
    })(
      Event,
      randomUUID(),
      eventName,
      eventStartingDate,
      eventEndingDate,
      hall,
    );
    await this.adaptedDataVendor.saveEvent(event);

    return {
      eventId: event.id,
      eventName: event.name,
    };
  }
}
