import MariaDBStorageVendor from '../mariadb-storage-vendor';
import utilityQueries from './utility-queries';

export default async function startInTestEnvironment(
  mariaDBSV: MariaDBStorageVendor,
): Promise<void> {
  await mariaDBSV.start(async (pool) => {
    await utilityQueries.InitializeTables(pool);
    await utilityQueries.ClearStoredTableData(pool);
    await utilityQueries.InsertDummyTableData(pool);
  });
}
