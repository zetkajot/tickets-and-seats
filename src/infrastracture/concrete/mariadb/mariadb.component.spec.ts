/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Pool } from 'mariadb';
import sinonChai from 'sinon-chai';
import { StoredEventData } from '../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../storage-vendors/ticket-storage-vendor';
import MariaDBStorageVendor from './mariadb-storage-vendor';
import ConfigSingleton from '../../../utils/config-singleton';
import utilityQueries from './utils/utility-queries';
import MariaDBConnector from './mariadb-connector';
import setupInTestEnv from './utils/setup-in-test-env';
import cleanupInTestEnv from './utils/cleanup-in-test-env';

use(chaiAsPromised);
use(sinonChai);

const { mariadbConfig } = ConfigSingleton.getConfig();
const connector = new MariaDBConnector(mariadbConfig);
let vendor: MariaDBStorageVendor;

describe('MariaDB SV Component test suite', () => {
  before(async () => {
    await connector.start(setupInTestEnv);
    vendor = new MariaDBStorageVendor(connector);
  });
  after(async () => {
    await connector.stop(cleanupInTestEnv);
  });
  describe('Table schema', () => {
    let tables: string[];
    before(async () => {
      tables = await getTables(connector.connectionPool);
    });
    it('Has \'Event\' table', () => {
      expect(tables).to.include('Event');
    });
    it('Has \'Ticket\' table', () => {
      expect(tables).to.include('Ticket');
    });
    it('Has \'Hall\' table', () => {
      expect(tables).to.include('Hall');
    });
  });
  describe('methods tests', () => {
    beforeEach(async () => {
      await resetTableContents(connector.connectionPool);
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
        const savedData = await connector.connectionPool.query('SELECT * FROM Hall WHERE id = \'hall-id-4\';');
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

        const savedData = await connector.connectionPool.query('SELECT * FROM Event WHERE id = \'event-id-4\';');

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

        const savedData = await connector.connectionPool.query('SELECT * FROM Ticket WHERE id = \'ticket-id-19\';');

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

        const deletedData = await connector.connectionPool.query('SELECT * FROM Hall WHERE id = \'hall-id-2\'');

        expect(deletedData).to.be.an('array').that.is.empty;
      });
    });
    describe('deleteEvent', () => {
      it('Removes matching data from db', async () => {
        await vendor.deleteEvent('event-id-1');

        const deletedData = await connector.connectionPool.query('SELECT * FROM Hall WHERE id = \'event-id-1\'');

        expect(deletedData).to.be.an('array').that.is.empty;
      });
    });
    describe('deleteTicket', () => {
      it('Removes matching data from db', async () => {
        await vendor.deleteTicket('ticket-id-1');

        const deletedData = await connector.connectionPool.query('SELECT * FROM Hall WHERE id = \'ticket-id-1\'');

        expect(deletedData).to.be.an('array').that.is.empty;
      });
    });
  });
  describe('SQL Injection Vulnerability test', () => {
    beforeEach(async () => {
      await resetTableContents(connector.connectionPool);
    });
    describe('Exploiting SELECT query', () => {
      it('OR 1=1 should not work', async () => {
        const results = await vendor.findEvent({ id: 'not-a-valid-id', hallId: '1\' OR 1=1; # ' });
        expect(results.length).to.be.equal(0);
      });
      it('UNION SELECT should not work', async () => {
        const maliciousId = 'not-an-id\' UNION SELECT 1, 2, 3 FROM event; # ';
        const result = await vendor.findTicket({ id: maliciousId });
        expect(result.length).to.be.equal(0);
      });
      it('Orphan apostrophes should not work', () => {
        const maliciousId = '\'';
        return expect(vendor.findTicket({ id: maliciousId })).to.eventually.be.fulfilled;
      });
    });
    describe('Exploiting INSERT query', () => {
      it('Orphan apostrophes should not work', () => {
        const maliciousString = '\'';
        return expect(vendor.saveHall({ id: maliciousString, layout: [], name: 'some-name' }))
          .to.eventually.be.fulfilled;
      });
    });
  });
});

async function getTables(pool: Pool): Promise<string[]> {
  const queryResult = <[{ Tables_in_test: string }]> await pool.query('SHOW TABLES;');
  return queryResult.map((row) => row.Tables_in_test);
}

async function resetTableContents(pool: Pool): Promise<void> {
  await utilityQueries.InitializeTables(pool);
  await utilityQueries.ClearStoredTableData(pool);
  await utilityQueries.InsertDummyTableData(pool);
}
