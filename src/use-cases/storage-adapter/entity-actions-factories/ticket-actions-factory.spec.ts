import testEntityActionsFactory from './test-entity-actions-factory';
import TicketActionsFactory from './ticket-actions-factory';
import makeDummyEvent from '../../use-case-utils/dummies/make-dummy-event';

describe('Ticket Actions Concrete Factory test suite', () => {
  testEntityActionsFactory(
    TicketActionsFactory,
    {
      id: 'example ticket id',
      event: makeDummyEvent('example event id'),
      seatNo: 1,
    },
    {
      id: 'example ticket id',
      eventId: 'example event id',
      seatNo: 1,
    },
    {
      eventId: 'example',
    },
    'example',
  );
});
