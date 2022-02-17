import { expect } from 'chai';
import sanitizeEventData from './sanitize-event-data';

describe('Event Data Sanitizer test suite', () => {
  describe('When any of the properties has undefined value', () => {
    it('Should delete that property', () => {
      const dataWithUndefinedProperty = {
        name: undefined,
      };

      const sanitizedData = sanitizeEventData(dataWithUndefinedProperty);

      expect(sanitizedData).to.not.have.property('name');
    });
  });
  describe('When startsAt property is present', () => {
    it('Should convert its value(Date) into epoch time', () => {
      const dataWithStartsAt = {
        startsAt: new Date('2017'),
      };

      const sanitizedData = sanitizeEventData(dataWithStartsAt);

      expect(sanitizedData).to.have.property('startsAt', new Date('2017').getTime());
    });
  });
  describe('When endsAt property is present', () => {
    it('Should convert its value(Date) into epoch time', () => {
      const dataWithEndsAt = {
        endsAt: new Date('2031'),
      };

      const sanitizedData = sanitizeEventData(dataWithEndsAt);

      expect(sanitizedData).to.have.property('endsAt', new Date('2031').getTime());
    });
  });
  describe('When reservedSeats property is present', () => {
    it('Should stringify its value to JSON', () => {
      const dataWithReservedSeats = {
        reservedSeats: [1, 2],
      };

      const sanitizedData = sanitizeEventData(dataWithReservedSeats);

      expect(sanitizedData).to.have.property('reservedSeats', JSON.stringify([1, 2]));
    });
  });
});
