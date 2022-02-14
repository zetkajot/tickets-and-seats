import { Pool } from 'mariadb';

export default async function insertDummyData(pool: Pool): Promise<void> {
  await pool.batch(
    'INSERT INTO hall (id, name, layout) VALUES (?, ?, ?);',
    [
      ['hall-id-1', 'hall no 1', '[]'],
      ['hall-id-2', 'hall no 2', '[[1, 0, 0]]'],
      ['hall-id-3', 'hall no 3', '[[2, 0, 0], [1, 10, 10]]'],
    ],
  );
  await pool.batch(
    'INSERT INTO event (id, name, hallid, startsat, endsat, isopen, reservedseats) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [
      ['event-id-1', 'event no 1', 'hall-id-1', new Date('2020').getTime(), new Date('2021').getTime(), false, '[]'],
      ['event-id-2', 'event no 2', 'hall-id-3', new Date('2013').getTime(), new Date('2019').getTime(), true, '[2, 1]'],
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
