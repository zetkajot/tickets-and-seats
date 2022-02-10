import { expect } from 'chai';
import { TicketResultSet } from '../types/ticket-result-set';
import resultSetToTicketData from './result-set-to-ticket-data';

const exampleTicketResultSet: TicketResultSet = [
  {
    id: 'ticket-id',
    eventid: 'event-id',
    seatno: 1,
  },
];

describe('resultSetToTicketData test suite', () => {
  describe('For every non-meta row', () => {
    it('Does not change value of any field', () => {
      const ticketData = resultSetToTicketData(exampleTicketResultSet);

      expect(ticketData[0].id).to.equal('ticket-id');
      expect(ticketData[0].eventId).to.equal('event-id');
      expect(ticketData[0].seatNo).to.equal(1);
    });
  });
});
