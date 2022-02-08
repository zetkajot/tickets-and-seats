import { expect } from 'chai';
import { StoredEventData } from '../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../storage-vendors/ticket-storage-vendor';
import MemoryStorageVendor from './memory-storage-vendor';

const validEventData: StoredEventData = {
  id: 'example-event-id',
  name: 'my example hall',
  hallId: 'example-hall-id',
  startsAt: new Date('2020'),
  endsAt: new Date('2021'),
  isOpen: true,
  reservedSeats: [1],
};

const validHallData: StoredHallData = {
  id: 'example-hall-id',
  name: 'my example hall',
  layout: [
    [1, 0, 0],
    [2, 10, 15],
  ],
};

const validTicketData: StoredTicketData = {
  id: 'example-ticket-id',
  eventId: 'example-event-id',
  seatNo: 1,
};

let eventStorage = [
  Object.create(validEventData),
];
let hallStorage = [
  Object.create(validHallData),
];
let ticketStorage = [
  Object.create(validTicketData),
];

let memoryStorage: MemoryStorageVendor;

describe('MemoryStorageVendor test suite', () => {
  beforeEach(() => {
    eventStorage = [
      Object.create(validEventData),
    ];
    hallStorage = [
      Object.create(validHallData),
    ];
    ticketStorage = [
      Object.create(validTicketData),
    ];
    memoryStorage = new MemoryStorageVendor(eventStorage, hallStorage, ticketStorage);
  });
  describe('saveEvent', () => {
    it('Adds provided StoredEventData to internal event data storage', async () => {
      const differentEventData = {
        ...validEventData,
        id: 'other-event-id',
      };
      await memoryStorage.saveEvent(differentEventData);

      expect(eventStorage).to.deep.include(differentEventData);
    });
  });
  describe('saveTicket', () => {
    it('Adds provided StoredTicketData to internal ticket data storage', async () => {
      const differentTicketData = {
        ...validTicketData,
        id: 'other-ticket-id',
      };
      await memoryStorage.saveTicket(differentTicketData);

      expect(ticketStorage).to.deep.include(differentTicketData);
    });
  });
  describe('saveHall', () => {
    it('Adds provided StoredHallData to internal hall data storage', async () => {
      const differentHallData = {
        ...validHallData,
        id: 'other-hall-id',
      };
      await memoryStorage.saveHall(differentHallData);

      expect(hallStorage).to.deep.include(differentHallData);
    });
  });
  describe('findHall', () => {
    it('Returns an array of StoredHallData matching all provided criteria', async () => {
      const foundData = await memoryStorage.findHall({
        name: 'my example hall',
      });

      expect(foundData).to.deep.equal([validHallData]);
    });
    it('Returns empty array when no criteria match', async () => {
      const foundData = await memoryStorage.findHall({
        name: 'not existing hall',
      });

      expect(foundData).to.deep.equal([]);
    });
  });
  describe('findTicket', () => {
    it('Returns an array of StoredTicketData matching all provided criteria', async () => {
      const foundData = await memoryStorage.findTicket({
        id: 'example-ticket-id',
        seatNo: 1,
      });

      expect(foundData).to.deep.equal([validTicketData]);
    });
    it('Returns empty array when no criteria match', async () => {
      const foundData = await memoryStorage.findTicket({
        eventId: 'not existing event id',
      });

      expect(foundData).to.deep.equal([]);
    });
  });
  describe('findEvent', () => {
    it('Returns an array of StoredEventData matching all provided criteria', async () => {
      const foundData = await memoryStorage.findEvent({
        id: 'example-event-id',
        hallId: 'example-hall-id',
      });

      expect(foundData).to.deep.equal([validEventData]);
    });
    it('Returns empty array when no criteria match', async () => {
      const foundData = await memoryStorage.findEvent({
        name: 'not existing event name',
      });

      expect(foundData).to.deep.equal([]);
    });
  });
  describe('deleteHall', () => {
    it('Removes StoredHallData matching given id from internal storage', async () => {
      await memoryStorage.deleteHall('example-hall-id');

      expect(hallStorage).to.not.deep.include(validHallData);
    });
  });
  describe('deleteTicket', () => {
    it('Removes StoredTicketData matching given id from internal storage', async () => {
      await memoryStorage.deleteTicket('example-ticket-id');

      expect(ticketStorage).to.not.deep.include(validTicketData);
    });
  });
  describe('deleteEvent', () => {
    it('Removes StoredEventData matching given id from internal storage', async () => {
      await memoryStorage.deleteEvent('example-event-id');

      expect(eventStorage).to.not.deep.include(validEventData);
    });
  });
});
