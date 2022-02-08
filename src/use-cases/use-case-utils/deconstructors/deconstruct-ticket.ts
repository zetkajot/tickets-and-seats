import Ticket from '../../../domain/ticket';
import { StoredTicketData } from '../../../infrastracture/storage-vendors/ticket-storage-vendor';

export default function deconstructTicket(ticket: Ticket): StoredTicketData {
  return {
    eventId: ticket.event.id,
    id: ticket.id,
    seatNo: ticket.seatNo,
  };
}
