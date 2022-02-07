import Event from '../../../domain/event';
import Ticket from '../../../domain/ticket';
import { StoredTicketData } from '../../../infrastracture/storage-vendors/ticket-storage-vendor';

export default function reconstructTicket(ticketData: StoredTicketData, event: Event): Ticket {
  return {
    id: ticketData.id,
    event,
    seatNo: ticketData.seatNo,
  };
}
