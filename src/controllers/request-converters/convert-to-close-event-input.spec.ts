import { expect } from 'chai';
import InvalidRequestError from '../errors/invalid-request-error';
import convertToCloseEventInput from './convert-to-close-event-input';

describe('convertToCloseEventInput test suite', () => {
  describe('When given request has no args', () => {
    it('Throws InvalidRequestError', () => {
      const request = {
        action: 'example',
        args: [],
      };

      const tryConverting = () => convertToCloseEventInput(request);

      expect(tryConverting).to.throw(InvalidRequestError);
    });
  });
  describe('When given request has at least one arg', () => {
    describe('When exactly one arg is named \'id\'', () => {
      it('Returns valid input for the use case', () => {
        const request = {
          action: 'example',
          args: [{
            name: 'id',
            value: 'example event id',
          }],
        };
        const result = convertToCloseEventInput(request);

        expect(result).to.deep.equal({
          eventId: 'example event id',
        });
      });
    });
    describe('When more than one arg is named \'id\'', () => {
      it('Throws InvalidRequestError', () => {
        const request = {
          action: 'example',
          args: [{
            name: 'id',
            value: 'some value 1',
          },
          {
            name: 'id',
            value: 'some value 2',
          }],
        };

        const tryConverting = () => convertToCloseEventInput(request);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
    describe('When none of the args is named \'id\'', () => {
      it('Throws InvalidRequestError', () => {
        const request = {
          action: 'example',
          args: [{
            name: 'not id',
            value: 'some value',
          }],
        };

        const tryConverting = () => convertToCloseEventInput(request);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
  });
});
