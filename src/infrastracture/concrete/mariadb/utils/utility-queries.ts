import { Pool } from 'mariadb';
import tableSchema from '../table-schema';

const utilityQueries = {
  InitializeTables: initializeTables,
  ClearStoredTableData: clearTableData,
  DropSchemaTables: dropTables,
  InsertDummyTableData: insertDummyData,
};

async function initializeTables(pool: Pool) {
  await pool.query(tableSchema.hall);
  await pool.query(tableSchema.event);
  await pool.query(tableSchema.ticket);
}

async function clearTableData(pool: Pool) {
  await pool.query('DELETE FROM ticket');
  await pool.query('DELETE FROM event');
  await pool.query('DELETE FROM hall');
}

async function dropTables(pool: Pool) {
  await pool.query('DROP TABLE IF EXISTS ticket, event, hall;');
}

async function insertDummyData(pool: Pool): Promise<void> {
  await pool.batch(
    'INSERT INTO hall (id, name, layout) VALUES (?, ?, ?);',
    [
      ['hall-id-1', 'hall no 1', '[]'],
      ['hall-id-2', 'hall no 2', '[[1, 0, 0]]'],
      ['hall-id-3', 'hall no 3', '[[2, 0, 0], [1, 10, 10]]'],
      ['hall-id-4', 'hall no 4', '[]'],
    ],
  );
  await pool.batch(
    'INSERT INTO event (id, name, hallid, startsat, endsat, isopen, reservedseats) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [
      ['event-id-1', 'event no 1', 'hall-id-1', new Date('2020').getTime(), new Date('2021').getTime(), false, '[]'],
      ['event-id-2', 'event no 2', 'hall-id-3', new Date('2013').getTime(), new Date('2019').getTime(), true, '[2, 1]'],
      ['event-id-3', 'event no 3', 'hall-id-2', new Date('2032').getTime(), new Date('2034').getTime(), true, '[]'],
      ['event-id-4', 'event no 4', 'hall-id-2', new Date('2032').getTime(), new Date('2034').getTime(), false, '[]'],
      ['event-id-5', 'event no 5', 'hall-id-2', new Date('2032').getTime(), new Date('2034').getTime(), true, '[]'],
    ],
  );
  await pool.batch(
    'INSERT INTO ticket (id, eventid, seatno) VALUES (?, ?, ?);',
    [
      ['ticket-id-1', 'event-id-2', 1],
      ['ticket-id-2', 'event-id-2', 2],
    ],
  );
}

export default utilityQueries;
