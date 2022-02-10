import { StoredTicketData } from '../../../storage-vendors/ticket-storage-vendor';
import { TicketResult, TicketResultSet } from '../types/ticket-result-set';
import isMetadata from './is-metadata';

export default function resultSetToTicketData(resultSet: TicketResultSet): StoredTicketData[] {
  const nonMetaRows = <TicketResult[]> resultSet.filter((row) => !isMetadata(row));
  return nonMetaRows.map((row) => ({
    id: row.id,
    eventId: row.eventid,
    seatNo: row.seatno,
  }));
}
