import testEntityActionsFactory from './test-entity-actions-factory';
import EventActionFactory from './event-actions-factory';
import Event from '../../../domain/event';
import makeHallDummy from '../../use-case-utils/dummies/make-hall-dummy';

describe('Event Action Concrete Factory test suite', () => {
  testEntityActionsFactory(
    EventActionFactory,
    new Event(
      'example event id',
      'example event',
      new Date('2021'),
      new Date('2022'),
      makeHallDummy('example hall id'),
    ),
    {
      id: 'example event id',
      name: 'example event',
      hallId: 'example hall id',
      startsAt: new Date('2021'),
      endsAt: new Date('2022'),
      isOpen: false,
      reservedSeats: [],
    },
    {
      name: 'example',
    },
    'example event id',
  );
});
