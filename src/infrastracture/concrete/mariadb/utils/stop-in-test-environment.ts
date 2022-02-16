import MariaDBStorageVendor from '../mariadb-storage-vendor';
import utilityQueries from './utility-queries';

export default async function stopInTestEnvironment(
  mariaDBSV: MariaDBStorageVendor,
): Promise<void> {
  await mariaDBSV.stop(async (pool) => {
    await utilityQueries.ClearStoredTableData(pool);
    await utilityQueries.DropSchemaTables(pool);
  });
}
