import { randomUUID } from 'crypto';
import Event from '../../domain/event';
import Hall from '../../domain/hall';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import UseCase from '../use-case';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import reconstructHall from '../use-case-utils/reconstructors/reconstruct-hall';
import tryExecutingStorageQuery from '../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryInstantiating from '../use-case-utils/try-catch-shorthands/try-instantiating';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';

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
    const hall = await this.findHall(hallId);

    const eventId = randomUUID();
    const event = <Event> tryInstantiating(
      Event,
      eventId,
      eventName,
      eventStartingDate,
      eventEndingDate,
      hall,
    );

    const eventData = deconstructEvent(event);

    await tryExecutingStorageQuery(this.dataVendor.saveEvent.bind(this.dataVendor), eventData);

    return {
      eventId: event.id,
      eventName: event.name,
    };
  }

  private async findHall(hallId: string): Promise<Hall> {
    const hallData = <StoredHallData> (await tryFindingEntityData.customized({
      related: false,
      allowEmpty: false,
      unique: true,
    })(this.dataVendor.findHall.bind(this.dataVendor), { id: hallId }))[0];

    const hall = <Hall> tryReconstructing(reconstructHall, hallData);

    return hall;
  }
}
