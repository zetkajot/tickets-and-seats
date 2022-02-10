import { expect } from 'chai';
import { EventResultSet } from '../types/event-result-set';
import resultSetToEventData from './result-set-to-event-data';

const exampleEventResultSet: EventResultSet = [
  {
    id: 'event-id',
    name: 'event name',
    endsat: new Date('2023').getTime(),
    startsat: new Date('2022').getTime(),
    hallid: 'hall-id',
    isopen: false,
    reservedseats: '[1, 3, 5]',
  },
];

describe('resultSetToEventData test suite', () => {
  describe('For every non-meta row', () => {
    it('Converts \'startsat\' and \'endsat\' values to dates', () => {
      const eventData = resultSetToEventData(exampleEventResultSet);

      expect(eventData[0].startsAt).to.deep.equal(new Date('2022'));
      expect(eventData[0].endsAt).to.deep.equal(new Date('2023'));
    });
    it('Converts \'reservedSeats\' to array', () => {
      const eventData = resultSetToEventData(exampleEventResultSet);

      expect(eventData[0].reservedSeats).to.deep.equal([1, 3, 5]);
    });
    it('Does not change the value of other fields', () => {
      const eventData = resultSetToEventData(exampleEventResultSet);

      expect(eventData[0].id).to.equal('event-id');
      expect(eventData[0].name).to.equal('event name');
      expect(eventData[0].hallId).to.equal('hall-id');
      expect(eventData[0].isOpen).to.equal(false);
    });
  });
});
