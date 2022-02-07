import Event from '../../domain/event';
import Hall from '../../domain/hall';
import Ticket from '../../domain/ticket';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../infrastracture/storage-vendors/ticket-storage-vendor';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import deconstructHall from '../use-case-utils/deconstructors/deconstruct-hall';
import deconstructTicket from '../use-case-utils/deconstructors/deconstruct-ticket';
import makeHallDummy from '../use-case-utils/dummies/make-hall-dummy';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';
import reconstructHall from '../use-case-utils/reconstructors/reconstruct-hall';
import tryExecutingStorageQuery from '../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';
import StorageAdapter from './storage-adapter';

export default function makeStorageAdapter(storageVendor: CombinedStorageVendor): StorageAdapter {
  return {
    findEvents,
    findRelatedEvents,
    findUniqueEvent,
    findUniqueRelatedEvent,
    saveEvent,
    deleteEvent,
    findHalls,
    findRelatedHalls,
    findUniqueHall,
    findUniqueRelatedHall,
    saveHall,
    deleteHall,
    findTickets,
    findRelatedTickets,
    findUniqueRelatedTicket,
    findUniqueTicket,
    saveTicket,
    deleteTicket,
  };

  async function findEvents(
    eventParams: Partial<Pick<StoredEventData, 'id' | 'hallId' | 'name'>>,
  ): Promise<Event[]> {
    const eventDataSet = await findEntityDataSet(eventParams, storageVendor.findEvent, 'normal');
    return reconstructEventsWithDummyHall(eventDataSet);
  }

  async function findRelatedEvents(
    eventParams: Partial<Pick<StoredEventData, 'id' | 'hallId' | 'name'>>,
  ): Promise<Event[]> {
    const eventDataSet = await findEntityDataSet(eventParams, storageVendor.findEvent, 'normal-related');
    return reconstructEventsWithDummyHall(eventDataSet);
  }

  async function findUniqueEvent(
    eventId:string,
  ): Promise<Event> {
    const eventDataSet = await findEntityDataSet({ id: eventId }, storageVendor.findEvent, 'unique');
    return reconstructEventsWithDummyHall(eventDataSet)[0];
  }

  async function findUniqueRelatedEvent(
    eventId:string,
  ): Promise<Event> {
    const eventDataSet = await findEntityDataSet({ id: eventId }, storageVendor.findEvent, 'unique-related');
    return reconstructEventsWithDummyHall(eventDataSet)[0];
  }

  async function saveEvent(
    event: Event,
  ): Promise<void> {
    await saveEntity(event, deconstructEvent, storageVendor.saveEvent);
  }

  async function deleteEvent(
    eventId: string,
  ): Promise<void> {
    await deleteEntity(eventId, findUniqueEvent, storageVendor.deleteEvent);
  }

  async function findHalls(
    hallParams: Partial<Omit<StoredHallData, 'layout' | 'id' >>,
  ): Promise<Hall[]> {
    const hallDataSet = await findEntityDataSet(hallParams, storageVendor.findHall, 'normal');
    return reconstructEntities(hallDataSet, reconstructHall);
  }

  async function findRelatedHalls(
    hallParams: Partial<Omit<StoredHallData, 'layout' | 'id' >>,
  ): Promise<Hall[]> {
    const hallDataSet = await findEntityDataSet(hallParams, storageVendor.findHall, 'normal-related');
    return reconstructEntities(hallDataSet, reconstructHall);
  }

  async function findUniqueHall(
    hallId: string,
  ): Promise<Hall> {
    const hallDataSet = await findEntityDataSet({ id: hallId }, storageVendor.findHall, 'unique');
    return reconstructEntities(hallDataSet, reconstructHall)[0];
  }

  async function findUniqueRelatedHall(
    hallId: string,
  ): Promise<Hall> {
    const hallDataSet = await findEntityDataSet({ id: hallId }, storageVendor.findHall, 'unique-related');
    return reconstructEntities(hallDataSet, reconstructHall)[0];
  }

  async function saveHall(
    hall: Hall,
  ): Promise<void> {
    await saveEntity(hall, deconstructHall, storageVendor.saveHall);
  }

  async function deleteHall(
    hallId: string,
  ): Promise<void> {
    await deleteEntity(hallId, findUniqueHall, storageVendor.deleteHall);
  }

  async function findTickets(
    ticketParams: Partial<Omit<StoredTicketData, 'seatNo'>>,
  ): Promise<Ticket[]> {
    const ticketDataSet = await findEntityDataSet(
      ticketParams,
      storageVendor.findTicket,
      'normal',
    );
    return reconstructTickets(ticketDataSet);
  }

  async function findRelatedTickets(
    ticketParams: Partial<Omit<StoredTicketData, 'seatNo'>>,
  ): Promise<Ticket[]> {
    const ticketDataSet = await findEntityDataSet(
      ticketParams,
      storageVendor.findTicket,
      'normal-related',
    );
    return reconstructTickets(ticketDataSet);
  }

  async function findUniqueTicket(
    ticketId: string,
  ): Promise<Ticket> {
    const ticketDataSet = await findEntityDataSet(
      { id: ticketId },
      storageVendor.findTicket,
      'unique',
    );
    return (await reconstructTickets(ticketDataSet))[0];
  }

  async function findUniqueRelatedTicket(
    ticketId: string,
  ): Promise<Ticket> {
    const ticketDataSet = await findEntityDataSet(
      { id: ticketId },
      storageVendor.findTicket,
      'unique-related',
    );
    return (await reconstructTickets(ticketDataSet))[0];
  }

  async function saveTicket(ticket: Ticket): Promise<void> {
    saveEntity(ticket, deconstructTicket, storageVendor.saveTicket);
  }

  async function deleteTicket(ticketId: string): Promise<void> {
    await deleteEntity(ticketId, findUniqueTicket, storageVendor.deleteTicket);
  }

  type FindType = 'normal' | 'normal-related' | 'unique' | 'unique-related';

  async function findEntityDataSet<EntityData, EntityParams extends Partial<EntityData>>(
    entityParams: EntityParams,
    entityFinder: (params: EntityParams) => Promise<EntityData[]>,
    findType: FindType = 'normal',
  ): Promise<EntityData[]> {
    return <EntityData[]> await tryFindingEntityData.customized(
      getOptionsFromFindType(findType),
    )(entityFinder.bind(storageVendor), entityParams);
  }

  function getOptionsFromFindType(
    findType: FindType,
  ): { allowEmpty: boolean, related:boolean, unique: boolean } {
    const optionsLookup: {
      [k in FindType]: { allowEmpty: boolean, related:boolean, unique: boolean }
    } = {
      normal: { allowEmpty: true, related: false, unique: false },
      'normal-related': { allowEmpty: false, related: true, unique: false },
      unique: { allowEmpty: false, related: false, unique: true },
      'unique-related': { allowEmpty: false, related: true, unique: true },
    };
    return optionsLookup[findType];
  }

  function reconstructEventsWithDummyHall(eventDataSet: StoredEventData[]): Event[] {
    return eventDataSet.map((eventData) => tryReconstructing(
      reconstructEvent,
      eventData,
      makeHallDummy(eventData.hallId),
    ));
  }

  function reconstructEntities<EntityData, Entity>(
    entityDataSet: EntityData[],
    entityReconstructor: (entityData: EntityData, ...otherArgs: any[]) => Entity,
    ...otherReconstructorArgs: any[]
  ): Entity[] {
    return (entityDataSet).map((entityData) => <Entity> tryReconstructing(
      entityReconstructor,
      entityData,
      ...otherReconstructorArgs,
    ));
  }

  async function saveEntity<Entity, EntityData>(
    entity: Entity,
    entityDeconstructor: (entity: Entity)=>EntityData,
    entitySaver: (entityData: EntityData)=>Promise<void>,
  ): Promise<void> {
    const entityData = entityDeconstructor(entity);
    await tryExecutingStorageQuery(entitySaver.bind(storageVendor), entityData);
  }

  async function deleteEntity<Entity>(
    entityId: string,
    uniqueEntityFinder: (entityId: string)=>Promise<Entity>,
    entityDeleter: (entityId: string)=>Promise<void>,
  ): Promise<void> {
    await uniqueEntityFinder(entityId);
    await tryExecutingStorageQuery(entityDeleter.bind(storageVendor), entityId);
  }

  async function reconstructTickets(ticketDataSet: StoredTicketData[]): Promise<Ticket[]> {
    const promiseArray = ticketDataSet.map(async (ticketData) => ({
      id: ticketData.id,
      event: await findUniqueRelatedEvent(ticketData.eventId),
      seatNo: ticketData.seatNo,
    }));
    return Promise.all(promiseArray).then((tickets) => tickets).catch((error) => {
      throw error;
    });
  }
}
