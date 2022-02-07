import Event from '../../domain/event';
import Hall from '../../domain/hall';
import Ticket from '../../domain/ticket';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../infrastracture/storage-vendors/ticket-storage-vendor';

export default interface StorageAdapter {
  findEvents: (eventParams: Partial<Pick<StoredEventData, 'hallId' | 'name'>>) => Promise<Event[]>,
  findRelatedEvents: (eventParams: Partial<Pick<StoredEventData, 'hallId' | 'name'>>) => Promise<Event[]>,
  findUniqueEvent: (eventId: string) => Promise<Event>;
  findUniqueRelatedEvent: (eventId: string) => Promise<Event>;
  saveEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;

  findHalls: (hallParams: Partial<Omit<StoredHallData, 'layout' | 'id' >>) => Promise<Hall[]>,
  findRelatedHalls: (hallParams: Partial<Omit<StoredHallData, 'layout' | 'id' >>) => Promise<Hall[]>,
  findUniqueHall: (hallId: string) => Promise<Hall>,
  findUniqueRelatedHall: (hallId: string) => Promise<Hall>,
  saveHall: (hall: Hall) => Promise<void>,
  deleteHall: (hallId: string) => Promise<void>,

  saveTicket: (ticket: Ticket) => Promise<void>,
  findTickets: (ticket: Partial<Omit<StoredTicketData, 'seatNo'>>) => Promise<Ticket[]>;
  findRelatedTickets: (ticket: Partial<Omit<StoredTicketData, 'seatNo'>>) => Promise<Ticket[]>;
  findUniqueTicket: (ticketId: string) => Promise<Ticket>,
  findUniqueRelatedTicket: (ticketId: string) => Promise<Ticket>,
  deleteTicket: (ticketId: string) => Promise<void>;
}
