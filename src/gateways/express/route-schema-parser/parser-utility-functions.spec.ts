import { expect } from 'chai';
import { exactValue, inValues } from './parser-utility-functions';

describe('Parser Utility Functions test suite', () => {
  describe('inValues function', () => {
    const fn = inValues([1, 3, 'jty', false]);
    describe('When values include target value', () => {
      it('Should return true', () => {
        expect(fn('jty')).to.equal(true);
      });
    });
    describe('When values do not include target value', () => {
      it('Should return false', () => {
        expect(fn(true)).to.equal(false);
      });
    });
  });
  describe('exactValue function', () => {
    const fn = exactValue('knamje');
    describe('When value is the same as the target value', () => {
      it('Should return true', () => {
        expect(fn('knamje')).to.equal(true);
      });
    });
    describe('When value is not the same as the target value', () => {
      it('Should return false', () => {
        expect(fn('')).to.equal(false);
      });
    });
  });
});
