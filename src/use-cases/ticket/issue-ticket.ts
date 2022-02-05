import { randomUUID } from 'crypto';
import Event from '../../domain/event';
import UseCase from '../use-case';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';
import reconstructHall from '../use-case-utils/reconstructors/reconstruct-hall';
import Hall from '../../domain/hall';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryEntityInteraction from '../use-case-utils/try-catch-shorthands/try-entity-interaction';
import tryExecutingStorageQuery from '../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';

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
    const eventData = await this.findEventData(eventId);
    const relatedHallData = await this.findRelatedHallData(eventData.hallId);

    const relatedHall = <Hall> tryReconstructing(reconstructHall, relatedHallData);
    const event = <Event> tryReconstructing(reconstructEvent, eventData, relatedHall);

    tryEntityInteraction()(event.reserveSeat.bind(event), seatNo);

    tryExecutingStorageQuery(
      this.dataVendor.saveEvent.bind(this.dataVendor),
      deconstructEvent(event),
    );

    const ticketData = {
      id: randomUUID(),
      eventId: event.id,
      seatNo,
    };

    tryExecutingStorageQuery(this.dataVendor.saveTicket.bind(this.dataVendor), ticketData);

    return {
      ticketId: ticketData.id,
      eventId: event.id,
      eventName: event.name,
      hallName: relatedHall.name,
      seatNo,
      eventStartingDate: event.startsAt,
      eventEndingDate: event.endsAt,
    };
  }

  private async findRelatedHallData(hallId: string): Promise<StoredHallData> {
    const hallData = <StoredHallData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: true,
      unique: true,
    })(this.dataVendor.findHall.bind(this.dataVendor), { id: hallId }))[0];

    return hallData;
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
