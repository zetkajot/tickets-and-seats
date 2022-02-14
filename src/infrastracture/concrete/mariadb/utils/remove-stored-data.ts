import { Pool } from 'mariadb';

export default async function removeStoredData(pool: Pool): Promise<void> {
  await pool.query('DELETE FROM ticket');
  await pool.query('DELETE FROM event');
  await pool.query('DELETE FROM hall');
}
