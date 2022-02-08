import TicketActionsFactory from './entity-actions-factories/ticket-actions-factory';
import EventActionsFactory from './entity-actions-factories/event-actions-factory';
import HallActionsFactory from './entity-actions-factories/hall-actions-factory';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import StorageAdapter from './storage-adapter';
import Event from '../../domain/event';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';
import Ticket from '../../domain/ticket';
import reconstructTicket from '../use-case-utils/reconstructors/reconstruct-ticket';
import deconstructTicket from '../use-case-utils/deconstructors/deconstruct-ticket';

export default function makeStorageAdapter(storageVendor: CombinedStorageVendor): StorageAdapter {
  const hallActionsFactory = new HallActionsFactory(storageVendor);
  const eventActionsFactory = new EventActionsFactory(storageVendor);
  const ticketActionsFactory = new TicketActionsFactory(storageVendor);

  return {
    findHalls: hallActionsFactory.makeFindMany(),
    findRelatedHalls: hallActionsFactory.makeFindManyRelated(),
    findUniqueHall: hallActionsFactory.makeFindUnique(),
    findUniqueRelatedHall: hallActionsFactory.makeFindUniqueRelated(),
    saveHall: hallActionsFactory.makeSaveOne(),
    deleteHall: hallActionsFactory.makeDeleteOne(),

    findEvents: eventActionsFactory.makeFindMany(),
    findRelatedEvents: eventActionsFactory.makeFindManyRelated(),
    findUniqueEvent: eventActionsFactory.makeFindUnique(),
    findUniqueRelatedEvent: eventActionsFactory.makeFindUniqueRelated(),
    saveEvent: eventActionsFactory.makeSaveOne(),
    deleteEvent: eventActionsFactory.makeDeleteOne(),
    plugRealHall,

    findTickets: ticketActionsFactory.makeFindMany(),
    findRelatedTickets: ticketActionsFactory.makeFindManyRelated(),
    findUniqueTicket: ticketActionsFactory.makeFindUnique(),
    findUniqueRelatedTicket: ticketActionsFactory.makeFindUniqueRelated(),
    saveTicket: ticketActionsFactory.makeSaveOne(),
    deleteTicket: ticketActionsFactory.makeDeleteOne(),
    plugRealEvent,
  };

  async function plugRealHall(event: Event): Promise<Event> {
    const realHall = await hallActionsFactory.makeFindUniqueRelated()(event.hallId);
    const eventData = deconstructEvent(event);
    return tryReconstructing(reconstructEvent, eventData, realHall);
  }

  async function plugRealEvent(ticket: Ticket): Promise<Ticket> {
    const partialyRealEvent = await eventActionsFactory.makeFindUniqueRelated()(ticket.event.id);
    const realEvent = await plugRealHall(partialyRealEvent);
    return tryReconstructing(
      reconstructTicket,
      deconstructTicket(ticket),
      realEvent,
    );
  }
}
