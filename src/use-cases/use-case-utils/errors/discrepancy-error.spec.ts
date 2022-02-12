/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import Sinon from 'sinon';
import { PassThrough } from 'stream';
import Logger from '../../../utils/logger/logger';
import DiscrepancyError from './discrapency-error';

const spiedFormatter = {
  formatDebug: Sinon.spy((msg: string) => msg),
  formatError: Sinon.spy((msg: string) => msg),
  formatFatal: Sinon.spy((msg: string) => msg),
  formatInfo: Sinon.spy((msg: string) => msg),
  formatWarn: Sinon.spy((msg: string) => msg),
};

describe('Discrepacy Error test suite', () => {
  describe('When initialized using withLogger()', () => {
    beforeEach(() => {
      Sinon.reset();
    });
    it('logs with level ERROR', () => {
      const logger = new Logger(spiedFormatter, new PassThrough());
      const testError = DiscrepancyError.withLogger(
        logger,
        new Error(),
      );

      expect(spiedFormatter.formatFatal).to.not.have.been.called;
      expect(spiedFormatter.formatDebug).to.not.have.been.called;
      expect(spiedFormatter.formatError).to.have.been.called;
      expect(spiedFormatter.formatInfo).to.not.have.been.called;
      expect(spiedFormatter.formatWarn).to.not.have.been.called;
    });
    it('logs name of underlying error', () => {
      const logger = new Logger(spiedFormatter, new PassThrough());
      const testError = DiscrepancyError.withLogger(
        logger,
        new Error(),
      );

      expect(spiedFormatter.formatError.firstCall.args[0]).to.include('Error');
    });
    it('logs message of underlying error', () => {
      const logger = new Logger(spiedFormatter, new PassThrough());
      const testError = DiscrepancyError.withLogger(
        logger,
        new Error('some msg'),
      );

      expect(spiedFormatter.formatError.firstCall.args[0]).to.include('some msg');
    });
  });
});
