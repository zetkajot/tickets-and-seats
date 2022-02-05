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
    return this.eventStorage.filter(({ id, name, hallId }) => {
      let isMatching = false;
      isMatching = id === data.id || data.id === undefined;
      isMatching = name === data.name || data.name === undefined;
      isMatching = hallId === data.hallId || data.hallId === undefined;
      return isMatching;
    });
  }

  deleteEvent(eventId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async saveHall(data: StoredHallData): Promise<void> {
    this.hallStorage.push(data);
  }

  async findHall(data: Partial<Omit<StoredHallData, 'layout'>>): Promise<StoredHallData[]> {
    return this.hallStorage.filter(({ id, name }) => {
      let isMatching = false;
      isMatching = id === data.id || data.id === undefined;
      isMatching = name === data.name || data.name === undefined;
      return isMatching;
    });
  }

  deleteHall(hallId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async saveTicket(data: StoredTicketData): Promise<void> {
    this.ticketStorage.push(data);
  }

  findTicket(data: Partial<StoredTicketData>): Promise<StoredTicketData[]> {
    throw new Error('Method not implemented.');
  }

  deleteTicket(ticketId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
