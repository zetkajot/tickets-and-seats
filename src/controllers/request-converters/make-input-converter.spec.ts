import { expect } from 'chai';
import Sinon from 'sinon';
import makeInputConverter from './make-input-converter';
import InvalidRequestError from '../errors/invalid-request-error';

describe('makeInputConverter test suite', () => {
  describe('Produced converter', () => {
    describe('When provided with less than required number of args', () => {
      it('Throws InvalidRequestError', () => {
        const converter = makeInputConverter('arg1', 'arg2', 'arg3');
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some value',
            },
          ],
        };

        const tryConverting = () => converter(request);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
    describe('When not all of request arguments names match those required', () => {
      it('Throws InvalidRequestError', () => {
        const converter = makeInputConverter('arg1', 'arg2');
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some value',
            },
            {
              name: 'arg15',
              value: 'some other value',
            },
          ],
        };

        const tryConverting = () => converter(request);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
    describe('When any of the request arguments have duplicate names', () => {
      it('Throws InvalidRequestError', () => {
        const converter = makeInputConverter('arg1', 'arg2');
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some value',
            },
            {
              name: 'arg2',
              value: 'some other value',
            },
            {
              name: 'arg1',
              value: 'and another value',
            },
          ],
        };

        const tryConverting = () => converter(request);

        expect(tryConverting).to.throw(InvalidRequestError);
      });
    });
    describe('When given argument has value converter set', () => {
      it('Tries to convert given argument value using specified converter', () => {
        const spiedValueConverter = Sinon.spy();
        const converter = makeInputConverter({
          argumentName: 'arg1',
          valueConverter: spiedValueConverter,
        });
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some-value',
            },
          ],
        };

        converter(request);

        expect(spiedValueConverter).to.have.been.called.calledOnceWithExactly('some-value');
      });
      describe('When conversion fails', () => {
        it('Throws InvalidRequestError', () => {
          const converter = makeInputConverter({
            argumentName: 'arg1',
            valueConverter: () => { throw new InvalidRequestError(); },
          });
          const request = {
            action: 'some action',
            args: [
              {
                name: 'arg1',
                value: 'some-value',
              },
            ],
          };

          const tryConverting = () => converter(request);

          expect(tryConverting).to.throw(InvalidRequestError);
        });
      });
      describe('When conversion suceeds', () => {
        it('Corresponding output field has its value set to result of converter', () => {
          const converter = makeInputConverter({
            argumentName: 'arg1',
            valueConverter: (val) => `-${val}-`,
          });
          const request = {
            action: 'some action',
            args: [
              {
                name: 'arg1',
                value: 'some-value',
              },
            ],
          };

          const output = converter(request);

          expect(output).to.deep.equal({ arg1: '-some-value-' });
        });
      });
    });
    describe('When given argument has desired name set', () => {
      it('Corresponding field in output data has its name set to desired name', () => {
        const converter = makeInputConverter({
          argumentName: 'arg1',
          desiredName: 'otherArg',
        });
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some-value',
            },
          ],
        };

        const output = converter(request);

        expect(output).to.deep.equal({ otherArg: 'some-value' });
      });
    });
    describe('When given argument has no desired name set', () => {
      it('Corresponding field in output data has the same name as argument name', () => {
        const converter = makeInputConverter('arg1');
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some-value',
            },
          ],
        };

        const output = converter(request);

        expect(output).to.deep.equal({ arg1: 'some-value' });
      });
    });
    describe('When given argument has \'optional\' flag set to true', () => {
      it('is not counted to total ammount of required args', () => {
        const converter = makeInputConverter('arg1', {
          argumentName: 'arg2',
          optional: true,
        });
        const request = {
          action: 'some action',
          args: [
            {
              name: 'arg1',
              value: 'some value',
            },
          ],
        };

        const tryConverting = () => converter(request);

        expect(tryConverting).to.not.throw(InvalidRequestError);
      });
    });
  });
});
