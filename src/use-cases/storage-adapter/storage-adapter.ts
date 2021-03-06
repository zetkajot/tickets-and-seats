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
  deleteEvent: (event: Event) => Promise<void>;
  plugRealHall: (event: Event) => Promise<Event>;

  findHalls: (hallParams: Partial<Omit<StoredHallData, 'layout' | 'id' >>) => Promise<Hall[]>,
  findRelatedHalls: (hallParams: Partial<Omit<StoredHallData, 'layout' | 'id' >>) => Promise<Hall[]>,
  findUniqueHall: (hallId: string) => Promise<Hall>,
  findUniqueRelatedHall: (hallId: string) => Promise<Hall>,
  saveHall: (hall: Hall) => Promise<void>,
  deleteHall: (hall: Hall) => Promise<void>,

  saveTicket: (ticket: Ticket) => Promise<void>,
  findTickets: (ticket: Partial<Omit<StoredTicketData, 'seatNo' | 'id' >>) => Promise<Ticket[]>;
  findRelatedTickets: (ticket: Partial<Omit<StoredTicketData, 'seatNo' | 'id' >>) => Promise<Ticket[]>;
  findUniqueTicket: (ticketId: string) => Promise<Ticket>,
  findUniqueRelatedTicket: (ticketId: string) => Promise<Ticket>,
  deleteTicket: (ticket: Ticket) => Promise<void>;
  plugRealEvent: (ticket: Ticket) => Promise<Ticket>;
}
