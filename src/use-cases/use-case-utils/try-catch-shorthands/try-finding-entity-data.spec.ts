import { expect } from 'chai';
import Sinon from 'sinon';
import DiscrepancyError from '../errors/discrapency-error';
import InvalidDataError from '../errors/invalid-data-error';
import tryFindingEntityData from './try-finding-entity-data';

describe('tryFindingEntityData helper test suite', () => {
  it('Calls finder function with given parameters to find stored entity data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const spiedFinderFn = Sinon.spy(async (someArg: string) => [1]);

    await tryFindingEntityData(spiedFinderFn, 'example string');

    expect(spiedFinderFn).to.have.been.calledOnceWithExactly('example string');
  });
  describe('When no entries of entity data were found', () => {
    describe('When flag \'allowEmpty\' is set to true', () => {
      it('Returns empty array', async () => {
        const emptyFinderFn = async () => [];

        const output = await tryFindingEntityData.customized({
          allowEmpty: true,
          unique: false,
          related: false,
        })(emptyFinderFn);

        expect(output).to.deep.equal([]);
      });
    });
    describe('When flag \'allowEmpty\' is set to false', () => {
      describe('When flag \'related\' is set to false', () => {
        it('Throws InvalidDataError', () => {
          const emptyFinderFn = async () => [];

          return expect(
            tryFindingEntityData.customized({
              allowEmpty: false,
              related: false,
              unique: false,
            })(emptyFinderFn),
          ).to.eventually.be.rejectedWith(InvalidDataError);
        });
      });
      describe('When flag \'related\' is set to true', () => {
        it('Throws DiscrepancyError', () => {
          const emptyFinderFn = async () => [];

          return expect(
            tryFindingEntityData.customized({
              allowEmpty: false,
              related: true,
              unique: false,
            })(emptyFinderFn),
          ).to.eventually.be.rejectedWith(DiscrepancyError);
        });
      });
    });
  });
  describe('When exactly one entry was found', () => {
    it('Returns found entity data', async () => {
      const exactFinderFn = async () => [1];

      const output = await tryFindingEntityData(exactFinderFn);

      expect(output).to.be.deep.equal([1]);
    });
  });
  describe('When more than one entry of entity data were found', () => {
    describe('When flag \'unique\' is set to false', () => {
      it('Returns found entity data', async () => {
        const overfilledFinderFn = async () => [1, 2];

        const output = await tryFindingEntityData.customized({
          allowEmpty: false,
          related: false,
          unique: false,
        })(overfilledFinderFn);

        expect(output).to.be.deep.equal([1, 2]);
      });
    });
    describe('When flag \'unique\' is set to true', () => {
      it('Throws DiscrepancyError', () => {
        const overfilledFinderFn = async () => [1, 2];

        return expect(
          tryFindingEntityData.customized({
            allowEmpty: false,
            related: false,
            unique: true,
          })(overfilledFinderFn),
        ).to.eventually.be.rejectedWith(DiscrepancyError);
      });
    });
  });
});
