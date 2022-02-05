import UseCase from '../use-case';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';
import reconstructHall from '../use-case-utils/reconstructors/reconstruct-hall';
import Hall from '../../domain/hall';
import Event from '../../domain/event';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';

type Input = {
  eventId: string
};

type Output = {
  eventId: string;
  eventName: string;
  hallName: string,
  startingDate: Date,
  endingDate: Date,
  isOpen: boolean,
};

export default class FindEventById extends UseCase<Input, Output> {
  async execute({ eventId }: Input): Promise<Output> {
    const eventData = await this.findEventData(eventId);
    const relatedHallData = await this.findRelatedHallData(eventData.hallId);

    const relatedHall = <Hall> tryReconstructing(reconstructHall, relatedHallData);
    const event = <Event> tryReconstructing(reconstructEvent, eventData, relatedHall);

    return {
      eventId: event.id,
      eventName: event.name,
      hallName: relatedHall.name,
      startingDate: event.startsAt,
      endingDate: event.endsAt,
      isOpen: event.isOpenForReservations,
    };
  }

  private async findRelatedHallData(hallId: string): Promise<StoredHallData> {
    const relatedHallData = <StoredHallData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: true,
      unique: true,
    })(this.dataVendor.findHall.bind(this.dataVendor), { id: hallId }))[0];

    return relatedHallData;
  }

  private async findEventData(eventId: string): Promise<StoredEventData> {
    const eventData = <StoredEventData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: false,
      unique: true,
    })(this.dataVendor.findEvent.bind(this.dataVendor), { id: eventId }))[0];

    return eventData;
  }
}
