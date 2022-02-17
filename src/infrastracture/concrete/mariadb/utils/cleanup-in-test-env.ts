import { Pool } from 'mariadb';
import utilityQueries from './utility-queries';

export default async function cleanupInTestEnv(
  pool: Pool,
): Promise<void> {
  await utilityQueries.ClearStoredTableData(pool);
  await utilityQueries.DropSchemaTables(pool);
}
