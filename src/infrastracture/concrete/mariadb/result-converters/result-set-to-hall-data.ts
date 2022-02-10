import { StoredHallData } from '../../../storage-vendors/hall-storage-vendor';
import { HallResult, HallResultSet } from '../types/hall-result-set';
import isMetadata from './is-metadata';

export default function resultSetToHallData(resultSet: HallResultSet): StoredHallData[] {
  const nonMetadataRows = <HallResult[]>resultSet.filter((row) => !isMetadata(row));
  return nonMetadataRows.map((row) => ({
    id: row.id,
    name: row.name,
    layout: JSON.parse(row.layout),
  }));
}
