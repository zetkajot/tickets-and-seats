import Event from '../../domain/event';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import UseCase from '../use-case';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import makeHallDummy from '../use-case-utils/dummies/make-hall-dummy';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';
import tryEntityInteraction from '../use-case-utils/try-catch-shorthands/try-entity-interaction';
import tryExecutingStorageQuery from '../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';

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
    const event = await this.findEvent(eventId);
    tryEntityInteraction()(event.closeForReservations.bind(event));
    await this.saveClosedEvent(event);

    return {
      eventId: event.id,
      eventName: event.name,
      isOpenForReservations: event.isOpenForReservations,
    };
  }

  private async findEvent(eventId: string): Promise<Event> {
    const eventData = <StoredEventData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: false,
      unique: true,
    })(this.dataVendor.findEvent.bind(this.dataVendor), { id: eventId }))[0];

    const dummyHall = makeHallDummy(eventData.hallId);

    return tryReconstructing(reconstructEvent, eventData, dummyHall);
  }

  private async saveClosedEvent(event: Event): Promise<void> {
    const eventData = deconstructEvent(event);
    await tryExecutingStorageQuery(this.dataVendor.saveEvent.bind(this.dataVendor), eventData);
  }
}
