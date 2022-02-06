import Hall from '../domain/hall';
import Ticket from '../domain/ticket';
import { StoredEventData } from '../infrastracture/storage-vendors/event-storage-vendor';
import { StoredHallData } from '../infrastracture/storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../infrastracture/storage-vendors/ticket-storage-vendor';

export default interface StorageAdapter {
  findEvents: (eventParams: Partial<Pick<StoredEventData, 'name' | 'hallId'>>) => Promise<Event[]>,
  findRelatedEvent: (eventParams: Partial<Pick<StoredEventData, 'name' | 'hallId'>>) => Promise<Event[]>,
  findUniqueEvent: (eventId: string) => Promise<Event>;
  findUniqueRelatedEvent: (eventId: string) => Promise<Event>;
  saveEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;

  findHalls: (hallParams: Partial<Omit<StoredHallData, 'layout' | 'id'>>) => Promise<Hall[]>,
  findRelatedHalls: (hallParams: Partial<Omit<StoredHallData, 'layout' | 'id'>>) => Promise<Hall[]>,
  findUniqueHall: (hallId: string) => Promise<Hall>,
  findUniqueRelatedHall: (hallId: string) => Promise<Hall>,
  saveHall: (hallData: Hall) => Promise<Hall[]>,
  deleteHall: (hallId: string) => Promise<void>,

  saveTicket: (ticket: Ticket) => Promise<void>,
  findTicket: (ticket: Partial<StoredTicketData>) => Promise<Ticket[]>;
  deleteTicket: (ticketId: string) => Promise<void>;
}
