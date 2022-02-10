import { StoredEventData } from '../../../storage-vendors/event-storage-vendor';
import { EventResult, EventResultSet } from '../types/event-result-set';
import isMetadata from './is-metadata';

export default function resultSetToEventData(resultSet: EventResultSet): StoredEventData[] {
  const nonMetadataRows = <EventResult[]> resultSet.filter((row) => !isMetadata(row));
  return nonMetadataRows.map((row) => ({
    id: row.id,
    name: row.name,
    hallId: row.hallid,
    startsAt: new Date(row.startsat),
    endsAt: new Date(row.endsat),
    isOpen: !!row.isopen,
    reservedSeats: row.reservedseats as any,
  }));
}
