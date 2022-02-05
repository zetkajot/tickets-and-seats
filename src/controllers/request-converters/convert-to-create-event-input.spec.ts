import { expect } from 'chai';
import InvalidRequestError from '../errors/invalid-request-error';
import convertToCreateEventInput from './convert-to-create-event-input';

describe('convertToCreateEventInput test suite', () => {
  describe('When provided with request with less than four args', () => {
    it('Throws InvalidRequestError', () => {
      const requestWithTwoArgs = {
        action: 'example',
        args: [
          {
            name: 'arg1',
            value: 'someval',
          },
          {
            name: 'arg2',
            value: 'someval',
          },
        ],
      };

      const tryConverting = () => convertToCreateEventInput(requestWithTwoArgs);

      expect(tryConverting).to.throw(InvalidRequestError);
    });
  });
  describe('When provided with request with at least four args', () => {
    describe('When args names match all of the following: \'name\', \'hallId\', \'startingDate\', \'endingDate\'', () => {
      describe('When there are no args with duplicate name', () => {
        describe('When dates created from  \'startingDate\' and  \'startingDate\' values are not null', () => {
          it('Returns valid input for the use case', () => {
            const validRequest = {
              action: 'example',
              args: [
                {
                  name: 'name',
                  value: 'example event name',
                },
                {
                  name: 'hallId',
                  value: 'example hall id',
                },
                {
                  name: 'startingDate',
                  value: '2020',
                },
                {
                  name: 'endingDate',
                  value: '2025',
                },
              ],
            };

            const result = convertToCreateEventInput(validRequest);

            expect(result).to.deep.equal({
              eventName: 'example event name',
              hallId: 'example hall id',
              eventStartingDate: new Date('2020'),
              eventEndingDate: new Date('2025'),
            });
          });
        });
        describe('When any of the dates created from  \'startingDate\' and  \'startingDate\' values is null', () => {
          it('Throws InvalidRequestError', () => {
            const requestWithInvalidDateArg = {
              action: 'example',
              args: [
                {
                  name: 'name',
                  value: 'example event name',
                },
                {
                  name: 'hallId',
                  value: 'example hall id',
                },
                {
                  name: 'endingDate',
                  value: '2022',
                },
                {
                  name: 'endingDate',
                  value: 'not-a-date',
                },
              ],
            };

            const tryConverting = () => convertToCreateEventInput(requestWithInvalidDateArg);

            expect(tryConverting).to.throw(InvalidRequestError);
          });
        });
      });
      describe('When there are args with duplicate names', () => {
        it('Throws InvalidRequestError', () => {
          const requestWithDuplicateArgNames = {
            action: 'example',
            args: [
              {
                name: 'name',
                value: 'someval',
              },
              {
                name: 'hallId',
                value: 'someval',
              },
              {
                name: 'hallId',
                value: 'someval',
              },
              {
                name: 'startingDate',
                value: 'someval',
              },
              {
                name: 'endingDate',
                value: 'someval',
              },
            ],
          };

          const tryConverting = () => convertToCreateEventInput(requestWithDuplicateArgNames);

          expect(tryConverting).to.throw(InvalidRequestError);
        });
      });
    });
    describe('When args do not match all of the required names', () => {
      it('Throws InvalidRequestError', () => {
        const requestWithNotMatchingNames = {
          action: 'example',
          args: [
            {
              name: 'name',
              value: 'someval',
            },
            {
              name: 'hallId',
              value: 'someval',
            },
            {
              name: 'arg',
              value: 'someval',
            },
            {
              name: 'endingDate',
              value: 'someval',
            },
          ],
        };

        const tryConverting = () => convertToCreateEventInput(requestWithNotMatchingNames);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
  });
});
