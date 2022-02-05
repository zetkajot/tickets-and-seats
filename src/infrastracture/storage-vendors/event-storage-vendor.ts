export default interface EventStorageVendor {
  saveEvent(data: StoredEventData): Promise<void>;
  findEvent(data: Partial<Pick<StoredEventData, 'id' | 'name' | 'hallId'>>): Promise<StoredEventData[]>;
  deleteEvent(eventId: string): Promise<void>;
}

export type StoredEventData = {
  id: string;
  name: string;
  hallId: string;
  startsAt: Date;
  endsAt: Date;
  isOpen: boolean;
  reservedSeats: number[];
};
