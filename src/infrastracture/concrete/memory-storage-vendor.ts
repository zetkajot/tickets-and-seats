/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CombinedStorageVendor from '../storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../storage-vendors/ticket-storage-vendor';

export default class MemoryStorageVendor implements CombinedStorageVendor {
  constructor(
    private eventStorage: Array<StoredEventData> = [],
    private hallStorage: Array<StoredHallData> = [],
    private ticketStorage: Array<StoredTicketData> = [],
  ) {}

  async saveEvent(data: StoredEventData): Promise<void> {
    this.eventStorage.push(data);
  }

  async findEvent(data: Partial<Pick<StoredEventData, 'id' | 'name' | 'hallId'>>): Promise<StoredEventData[]> {
    return this.eventStorage.filter(({ id, name, hallId }) => (
      id === data.id || data.id === undefined)
      && (name === data.name || data.name === undefined)
      && (hallId === data.hallId || data.hallId === undefined));
  }

  async deleteEvent(eventId: string): Promise<void> {
    const targetId = this.eventStorage.findIndex((data) => data.id === eventId);
    this.eventStorage.splice(targetId, 1);
  }

  async saveHall(data: StoredHallData): Promise<void> {
    this.hallStorage.push(data);
  }

  async findHall(data: Partial<Omit<StoredHallData, 'layout'>>): Promise<StoredHallData[]> {
    return this.hallStorage.filter(({ id, name }) => (
      (id === data.id || data.id === undefined)
      && (name === data.name || data.name === undefined)
    ));
  }

  async deleteHall(hallId: string): Promise<void> {
    const targetId = this.hallStorage.findIndex((data) => data.id === hallId);
    this.hallStorage.splice(targetId, 1);
  }

  async saveTicket(data: StoredTicketData): Promise<void> {
    this.ticketStorage.push(data);
  }

  async findTicket(data: Partial<StoredTicketData>): Promise<StoredTicketData[]> {
    return this.ticketStorage.filter(({ id, eventId, seatNo }) => (
      (id === data.id || data.id === undefined)
      && (eventId === data.eventId || data.eventId === undefined)
      && (seatNo === data.seatNo || data.seatNo === undefined)
    ));
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const targetId = this.ticketStorage.findIndex((data) => data.id === ticketId);
    this.ticketStorage.splice(targetId, 1);
  }
}
