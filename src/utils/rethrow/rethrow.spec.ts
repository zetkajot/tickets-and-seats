/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { expect } from 'chai';
import Rethrower from './rethrower';

class Error1 extends Error {
  name: string = 'Error1';
}
class Error2 extends Error {
  name: string = 'Error2';
}
class Error3 extends Error {
  name: string = 'Error3';
}

const throwsError1 = () => { throw new Error1(); };
const throwsError2 = () => { throw new Error2(); };
const throwsError3 = () => { throw new Error3(); };

const convertError1ToError2 = (error: Error1) => new Error2();
const convertError1ToError3 = (error: Error1) => new Error3();
const convertError2ToError1 = (error: Error2) => new Error1();
const convertError2ToError3 = (error: Error2) => new Error3();
const convertError3ToError1 = (error: Error3) => new Error1();
const convertError3ToError2 = (error: Error3) => new Error2();

describe('Rethrow Test Suite', () => {
  describe('When error happens during execution', () => {
    it('Rethrows only matching errors', () => {
      const rethrower = new Rethrower(throwsError1);
      rethrower.addRethrow(Error3, convertError3ToError1);
      rethrower.addRethrow(Error2, convertError2ToError1);
      rethrower.addRethrow(Error1, convertError1ToError3);

      const tryRethrowing = () => rethrower.execute();

      expect(tryRethrowing).to.throw(Error3);
    });
    it('throws original error, when no matching rethrows were added', () => {
      const rethrower = new Rethrower(throwsError2);
      rethrower.addRethrow(Error1, convertError1ToError3);
      rethrower.addRethrow(Error3, convertError3ToError1);

      const tryRethrowing = () => rethrower.execute();

      expect(tryRethrowing).to.throw(Error2);
    });
  });
  describe('When no error occurs during execution', () => {
    it('no error is thrown', () => {
      const rethrower = new Rethrower(() => {});
      rethrower.addRethrow(Error1, convertError1ToError2);
      rethrower.addRethrow(Error2, convertError2ToError3);
      rethrower.addRethrow(Error3, convertError3ToError2);

      const tryRethrowing = () => rethrower.execute();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(tryRethrowing).to.not.throw;
    });
    it('returns value produced by calling target function using given args', () => {
      const rethrower = new Rethrower((...args: number[]) => args[2]);
      rethrower.addRethrow(Error1, convertError1ToError2);
      rethrower.addRethrow(Error2, convertError2ToError3);
      rethrower.addRethrow(Error3, convertError3ToError2);

      const result = rethrower.execute(15, 25, 82, -32);

      expect(result).to.equal(82);
    });
  });
});
