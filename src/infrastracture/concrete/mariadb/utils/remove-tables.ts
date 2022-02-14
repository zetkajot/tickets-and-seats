import { Pool } from 'mariadb';

export default async function removeTables(pool: Pool): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS ticket, event, hall;');
}
