import testEntityActionsFactory from './test-entity-actions-factory';
import HallActionsFactory from './hall-actions-factory';
import Hall from '../../../domain/hall';
import SeatLayout from '../../../domain/seat-layout';

describe('Hall Action Concrete Factory test suite', () => {
  testEntityActionsFactory(
    HallActionsFactory,
    new Hall(
      'example hall id',
      'example hall',
      new SeatLayout(),
    ),
    {
      id: 'example hall id',
      name: 'example hall',
      layout: [],
    },
    {
      name: 'example',
    },
    'example hall id',
  );
});
