import { expect } from 'chai';
import sanitizeTicketData from './sanitize-ticket-data';

describe('Ticket Data Sanitizer test suite', () => {
  describe('When any of the properties has undefined value', () => {
    it('Should delete that property', () => {
      const dataWithUndefinedProperty = {
        eventId: undefined,
      };

      const sanitizedData = sanitizeTicketData(dataWithUndefinedProperty);

      expect(sanitizedData).to.not.have.property('eventId');
    });
  });
});
