import { Pool } from 'mariadb';
import utilityQueries from './utility-queries';

export default async function setupInTestEnv(
  pool: Pool,
): Promise<void> {
  await utilityQueries.InitializeTables(pool);
  await utilityQueries.ClearStoredTableData(pool);
  await utilityQueries.InsertDummyTableData(pool);
}
