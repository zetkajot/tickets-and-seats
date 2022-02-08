/* eslint-disable class-methods-use-this */
import Event from '../../../domain/event';
import { StoredEventData } from '../../../infrastracture/storage-vendors/event-storage-vendor';
import deconstructEvent from '../../use-case-utils/deconstructors/deconstruct-event';
import makeDummyHall from '../../use-case-utils/dummies/make-dummy-hall';
import reconstructEvent from '../../use-case-utils/reconstructors/reconstruct-event';
import tryExecutingStorageQuery from '../../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import tryFindingEntityData from '../../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryReconstructing from '../../use-case-utils/try-catch-shorthands/try-reconstructing';
import {
  FindMany, FindOne, DeleteOne, SaveOne,
} from '../entity-actions';
import AbstractEntityActionsFactory from './abstract-entity-actions-factory';

export default class EventActionFactory
  extends AbstractEntityActionsFactory<Event, StoredEventData> {
  makeFindMany(): FindMany<Event, StoredEventData> {
    const { storageVendor } = this;
    return async function findMany(
      params: Partial<Pick<StoredEventData, 'hallId' | 'name'>>,
    ): Promise<Event[]> {
      const eventDataSet = <StoredEventData[]> await tryFindingEntityData.customized({
        allowEmpty: true,
        related: false,
        unique: false,
      })(storageVendor.findEvent.bind(storageVendor), params);

      return <Event[]> eventDataSet.map((eventData) => tryReconstructing(
        reconstructEvent,
        eventData,
        makeDummyHall({ id: eventData.hallId }),
      ));
    };
  }

  makeFindManyRelated(): FindMany<Event, StoredEventData> {
    const { storageVendor } = this;
    return async function findManyRelated(
      params: Partial<Pick<StoredEventData, 'hallId' | 'name'>>,
    ): Promise<Event[]> {
      const eventDataSet = <StoredEventData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: true,
        unique: false,
      })(storageVendor.findEvent.bind(storageVendor), params);

      return <Event[]> eventDataSet.map((eventData) => tryReconstructing(
        reconstructEvent,
        eventData,
        makeDummyHall({ id: eventData.hallId }),
      ));
    };
  }

  makeFindUnique(): FindOne<Event, any> {
    const { storageVendor } = this;
    return async function findUnique(
      eventId: string,
    ): Promise<Event> {
      const eventDataSet = <StoredEventData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: false,
        unique: true,
      })(storageVendor.findEvent.bind(storageVendor), { id: eventId });

      return <Event> eventDataSet.map((eventData) => tryReconstructing(
        reconstructEvent,
        eventData,
        makeDummyHall({ id: eventData.hallId }),
      ))[0];
    };
  }

  makeFindUniqueRelated(): FindOne<Event, any> {
    const { storageVendor } = this;
    return async function findUniqueRelated(
      eventId: string,
    ): Promise<Event> {
      const eventDataSet = <StoredEventData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: true,
        unique: true,
      })(storageVendor.findEvent.bind(storageVendor), { id: eventId });

      return <Event> eventDataSet.map((eventData) => tryReconstructing(
        reconstructEvent,
        eventData,
        makeDummyHall({ id: eventData.hallId }),
      ))[0];
    };
  }

  makeDeleteOne(): DeleteOne<Event> {
    const { storageVendor } = this;
    return async function deleteEvent(event: Event) {
      await tryExecutingStorageQuery(
        storageVendor.deleteEvent.bind(storageVendor),
        event.id,
      );
    };
  }

  makeSaveOne(): SaveOne<Event> {
    const { storageVendor } = this;
    return async function saveEvent(event: Event) {
      await tryExecutingStorageQuery(
        storageVendor.saveEvent.bind(storageVendor),
        deconstructEvent(event),
      );
    };
  }
}
