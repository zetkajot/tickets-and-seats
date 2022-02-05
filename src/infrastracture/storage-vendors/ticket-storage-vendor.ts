export default interface TicketStorageVendor {
  saveTicket(data: StoredTicketData): Promise<void>;
  findTicket(data: Partial<StoredTicketData>): Promise<StoredTicketData[]>;
  deleteTicket(ticketId: string): Promise<void>;
}

export type StoredTicketData = {
  id: string,
  eventId: string,
  seatNo: number,
};
