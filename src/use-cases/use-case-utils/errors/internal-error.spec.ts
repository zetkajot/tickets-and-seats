/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import Sinon from 'sinon';
import { PassThrough } from 'stream';
import Logger from '../../../utils/logger/logger';
import InternalError, { InternalErrorSubtype } from './internal-error';

const spiedFormatter = {
  formatDebug: Sinon.spy((msg: string) => msg),
  formatError: Sinon.spy((msg: string) => msg),
  formatFatal: Sinon.spy((msg: string) => msg),
  formatInfo: Sinon.spy((msg: string) => msg),
  formatWarn: Sinon.spy((msg: string) => msg),
};

describe('Internal Error test suite', () => {
  describe('When initialized using withLogger()', () => {
    beforeEach(() => {
      Sinon.reset();
    });
    it('logs with level FATAL', () => {
      const logger = new Logger(spiedFormatter, new PassThrough());
      InternalError.withLogger(
        logger,
        InternalErrorSubtype.STORAGE_ERROR,
        new Error(),
      );

      expect(spiedFormatter.formatFatal).to.have.been.called;
      expect(spiedFormatter.formatDebug).to.not.have.been.called;
      expect(spiedFormatter.formatError).to.not.have.been.called;
      expect(spiedFormatter.formatInfo).to.not.have.been.called;
      expect(spiedFormatter.formatWarn).to.not.have.been.called;
    });
    it('logs name of underlying error', () => {
      const logger = new Logger(spiedFormatter, new PassThrough());
      InternalError.withLogger(
        logger,
        InternalErrorSubtype.STORAGE_ERROR,
        new Error(),
      );

      expect(spiedFormatter.formatFatal.firstCall.args[0]).to.include('Error');
    });
    it('logs message of underlying error', () => {
      const logger = new Logger(spiedFormatter, new PassThrough());
      InternalError.withLogger(
        logger,
        InternalErrorSubtype.STORAGE_ERROR,
        new Error('some msg'),
      );

      expect(spiedFormatter.formatFatal.firstCall.args[0]).to.include('some msg');
    });
  });
});
