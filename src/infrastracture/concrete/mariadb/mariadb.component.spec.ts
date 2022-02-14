/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { createPool, Pool } from 'mariadb';
import { StoredEventData } from '../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../storage-vendors/ticket-storage-vendor';
import makeMariaDBStorageVendor from './make-maria-db-storage-vendor';
import MariaDBStorageVendor from './mariadb-storage-vendor';
import ConfigSingleton from '../../../utils/config-singleton';
import insertDummyData from './utils/insert-dummy-data';
import removeStoredData from './utils/remove-stored-data';

const connectionPool = createPool(ConfigSingleton.getConfig().mariadbConfig);

describe('MariaDB SV Component test suite', () => {
  let vendor: MariaDBStorageVendor;
  before(async () => {
    vendor = await makeMariaDBStorageVendor(connectionPool);
    await removeStoredData(vendor.connectionPool);
  });
  after(async () => {
    await removeStoredData(vendor.connectionPool);
    await vendor.connectionPool.end();
  });
  describe('Table schema', () => {
    let tables: string[];
    before(async () => {
      tables = await getTables(vendor.connectionPool);
    });
    it('Has \'event\' table', () => {
      expect(tables).to.include('event');
    });
    it('Has \'ticket\' table', () => {
      expect(tables).to.include('ticket');
    });
    it('Has \'hall\' table', () => {
      expect(tables).to.include('hall');
    });
  });
  describe('methods tests', () => {
    beforeEach(async () => {
      await insertDummyData(vendor.connectionPool);
    });
    afterEach(async () => {
      await removeStoredData(vendor.connectionPool);
    });
    describe('findHall', () => {
      it('Returns matching data stored in DB', async () => {
        const result = await vendor.findHall({ id: 'hall-id-2' });
        expect(result[0]).to.deep.equal(
          {
            id: 'hall-id-2',
            name: 'hall no 2',
            layout: [
              [1, 0, 0],
            ],
          },
        );
      });
    });
    describe('findEvent', () => {
      it('Returns matching data stored in DB', async () => {
        const result = await vendor.findEvent({ hallId: 'hall-id-3' });

        expect(result[0]).to.deep.equal(
          {
            id: 'event-id-2',
            name: 'event no 2',
            hallId: 'hall-id-3',
            startsAt: new Date('2013'),
            endsAt: new Date('2019'),
            isOpen: true,
            reservedSeats: [2, 1],
          },
        );
      });
    });
    describe('findTicket', () => {
      it('Returns matching data stored in DB', async () => {
        const result = await vendor.findTicket({ id: 'ticket-id-1' });

        expect(result[0]).to.deep.equal({
          id: 'ticket-id-1',
          eventId: 'event-id-2',
          seatNo: 1,
        });
      });
    });
    describe('saveHall', () => {
      it('Saves given data in DB', async () => {
        const hallData: StoredHallData = {
          id: 'hall-id-4',
          name: 'my precious hall',
          layout: [[3, 13, 12], [293, 23, 184]],
        };
        await vendor.saveHall(hallData);
        const savedData = await vendor.connectionPool.query('SELECT * FROM hall WHERE id = \'hall-id-4\';');
        expect(savedData[0]).to.deep.equal({
          id: 'hall-id-4',
          name: 'my precious hall',
          layout: [[3, 13, 12], [293, 23, 184]],
        });
      });
    });
    describe('saveEvent', () => {
      it('Saves given data in DB', async () => {
        const eventData: StoredEventData = {
          id: 'event-id-4',
          name: 'my super event',
          startsAt: new Date('2013'),
          endsAt: new Date('2083'),
          hallId: 'hall-id-2',
          isOpen: true,
          reservedSeats: [1],
        };
        await vendor.saveEvent(eventData);

        const savedData = await vendor.connectionPool.query('SELECT * FROM event WHERE id = \'event-id-4\';');

        expect(savedData[0]).to.deep.equal({
          id: eventData.id,
          name: eventData.name,
          startsat: eventData.startsAt.getTime(),
          endsat: eventData.endsAt.getTime(),
          isopen: +eventData.isOpen,
          hallid: eventData.hallId,
          reservedseats: eventData.reservedSeats,
        });
      });
    });
    describe('saveTicket', () => {
      it('Saves given data in DB', async () => {
        const ticketData: StoredTicketData = {
          eventId: 'event-id-2',
          id: 'ticket-id-19',
          seatNo: 33,
        };

        await vendor.saveTicket(ticketData);

        const savedData = await vendor.connectionPool.query('SELECT * FROM ticket WHERE id = \'ticket-id-19\';');

        expect(savedData[0]).to.deep.equal({
          id: 'ticket-id-19',
          eventid: 'event-id-2',
          seatno: 33,
        });
      });
    });
    describe('deleteHall', () => {
      it('Removes matching data from db', async () => {
        await vendor.deleteHall('hall-id-2');

        const deletedData = await vendor.connectionPool.query('SELECT * FROM hall WHERE id = \'hall-id-2\'');

        expect(deletedData).to.be.an('array').that.is.empty;
      });
    });
    describe('deleteEvent', () => {
      it('Removes matching data from db', async () => {
        await vendor.deleteEvent('event-id-1');

        const deletedData = await vendor.connectionPool.query('SELECT * FROM hall WHERE id = \'event-id-1\'');

        expect(deletedData).to.be.an('array').that.is.empty;
      });
    });
    describe('deleteTicket', () => {
      it('Removes matching data from db', async () => {
        await vendor.deleteTicket('ticket-id-1');

        const deletedData = await vendor.connectionPool.query('SELECT * FROM hall WHERE id = \'ticket-id-1\'');

        expect(deletedData).to.be.an('array').that.is.empty;
      });
    });
  });
});

async function getTables(pool: Pool): Promise<string[]> {
  const queryResult = <[{ Tables_in_test: string }]> await pool.query('SHOW TABLES;');
  return queryResult.map((row) => row.Tables_in_test);
}
