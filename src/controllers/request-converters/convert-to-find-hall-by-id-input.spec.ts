import { expect } from 'chai';
import InvalidRequestError from '../errors/invalid-request-error';
import convertToFindHallByIdInput from './convert-to-find-hall-by-id-input';

describe('convertToFindHallByIdInput test suite', () => {
  describe('When given request has no args', () => {
    it('Throws InvalidRequestError', () => {
      const request = {
        action: 'example',
        args: [],
      };

      const tryConverting = () => convertToFindHallByIdInput(request);

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
            value: 'example hall id',
          }],
        };
        const result = convertToFindHallByIdInput(request);

        expect(result).to.deep.equal({
          hallId: 'example hall id',
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

        const tryConverting = () => convertToFindHallByIdInput(request);

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

        const tryConverting = () => convertToFindHallByIdInput(request);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
  });
});
