import { expect } from 'chai';
import InvalidRequestError from '../errors/invalid-request-error';
import convertToCreateHallInput from './convert-to-create-hall-input';

describe('convertToCreateHallInput test suite', () => {
  describe('When provided with request with at least 2 arguments', () => {
    describe('When request arguments match all of the following: \'name\', \'layout\'', () => {
      describe('When there are no arguments with duplicate names', () => {
        describe('When layout is valid json object', () => {
          it('Returns valid input for use case', () => {
            const validRequest = {
              action: 'some action',
              args: [
                {
                  name: 'name',
                  value: 'example hall',
                },
                {
                  name: 'layout',
                  value: '[]',
                },
              ],
            };

            const result = convertToCreateHallInput(validRequest);

            expect(result).to.deep.equal({
              hallName: 'example hall',
              seatLayout: [],
            });
          });
        });
        describe('When layout is invalid json', () => {
          it('Throws InvalidRequestError', () => {
            const invalidRequest = {
              action: 'action example',
              args: [
                {
                  name: 'name',
                  value: 'some val',
                },
                {
                  name: 'layout',
                  value: '}not-a-valid-json]',
                },
              ],
            };

            const tryConverting = () => convertToCreateHallInput(invalidRequest);

            expect(tryConverting).to.throw(InvalidRequestError);
          });
        });
      });
      describe('When there are arguments with duplicate names', () => {
        it('Throws InvalidRequestError', () => {
          const invalidRequest = {
            action: 'action example',
            args: [
              {
                name: 'name',
                value: 'some val',
              },
              {
                name: 'layout',
                value: 'some layout',
              },
              {
                name: 'name',
                value: 'some val',
              },
            ],
          };

          const tryConverting = () => convertToCreateHallInput(invalidRequest);

          expect(tryConverting).to.throw(InvalidRequestError);
        });
      });
    });
    describe('When not all of the request arguments match', () => {
      it('Throws InvalidRequestError', () => {
        const invalidRequest = {
          action: 'action example',
          args: [
            {
              name: 'example',
              value: 'some val',
            },
            {
              name: 'name',
              value: 'some val',
            },
          ],
        };

        const tryConverting = () => convertToCreateHallInput(invalidRequest);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
  });
  describe('When provided with request with less than 2 arguments', () => {
    it('Throws InvalidRequestError', () => {
      const invalidRequest = {
        action: 'action example',
        args: [
          {
            name: 'example',
            value: 'some val',
          },
        ],
      };

      const tryConverting = () => convertToCreateHallInput(invalidRequest);

      expect(tryConverting).to.throw(InvalidRequestError);
    });
  });
});
