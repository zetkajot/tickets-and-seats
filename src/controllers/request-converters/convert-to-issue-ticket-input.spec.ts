import { expect } from 'chai';
import InvalidRequestError from '../errors/invalid-request-error';
import convertToIssueTicketInput from './convert-to-issue-ticket-input';

describe('convertToIssueTicketInput test suite', () => {
  describe('When provided request has at least two args', () => {
    describe('When arguments names match following: \'eventId\', \'\'seatNo', () => {
      describe('When there are no arguments with duplicate names', () => {
        describe('When \'seatNo\' value can be converted to valid number', () => {
          it('Returns valid use case input', () => {
            const validRequest = {
              action: 'some action',
              args: [
                {
                  name: 'eventId',
                  value: 'xxyy',
                },
                {
                  name: 'seatNo',
                  value: '13',
                },
              ],
            };

            const result = convertToIssueTicketInput(validRequest);

            expect(result).to.deep.equal({
              eventId: 'xxyy',
              seatNo: 13,
            });
          });
        });
        describe('When \'seatNo\' value is converted to NaN', () => {
          it('Throws InvalidRequestError', () => {
            const invalidRequest = {
              action: 'some action',
              args: [
                {
                  name: 'eventId',
                  value: 'xxyy',
                },
                {
                  name: 'seatNo',
                  value: 'n0tANum3er',
                },
              ],
            };

            const tryConverting = () => convertToIssueTicketInput(invalidRequest);

            expect(tryConverting).to.throw(InvalidRequestError);
          });
        });
      });
      describe('When there are arguments with duplicate names', () => {
        it('Throws InvalidRequestError', () => {
          const invalidRequest = {
            action: 'some action',
            args: [
              {
                name: 'eventId',
                value: 'xxyy',
              },
              {
                name: 'eventId',
                value: 'xxyy',
              },
              {
                name: 'seatNo',
                value: 'xxyy',
              },
            ],
          };

          const tryConverting = () => convertToIssueTicketInput(invalidRequest);

          expect(tryConverting).to.throw(InvalidRequestError);
        });
      });
    });
    describe('When arguments dont match all', () => {
      it('Throws InvalidRequestError', () => {
        const invalidRequest = {
          action: 'some action',
          args: [
            {
              name: 'some arg',
              value: 'xxyy',
            },
            {
              name: 'seatNo',
              value: '1a2',
            },
          ],
        };

        const tryConverting = () => convertToIssueTicketInput(invalidRequest);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
  });
  describe('When provided request has less than two args', () => {
    it('Throws InvalidRequestError', () => {
      const invalidRequest = {
        action: 'some action',
        args: [
          {
            name: 'some arg',
            value: 'xxyy',
          },
        ],
      };

      const tryConverting = () => convertToIssueTicketInput(invalidRequest);

      expect(tryConverting).to.throw(InvalidRequestError);
    });
  });
});
