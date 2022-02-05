/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import Sinon from 'sinon';
import { PassThrough, Readable } from 'stream';
import LogFormatter from './log-formatter';
import Logger from './logger';

function makeDuplexLogStream() {
  return new PassThrough({
    objectMode: false,
    decodeStrings: true,
    encoding: 'utf-8',
    defaultEncoding: 'utf-8',
  });
}

function waitForAnyData(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      resolve(chunk);
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

describe('Logger test suite', () => {
  describe('Logging methods', () => {
    it('info() uses logFormatter.formatInfo()', () => {
      const infoFormatter = Sinon.spy((msg: string) => msg);
      const formatter = {
        formatInfo: infoFormatter,
      };
      const logger = new Logger(formatter as unknown as LogFormatter, makeDuplexLogStream());

      logger.info('example');

      expect(infoFormatter).to.have.been.calledOnceWithExactly('example');
    });
    it('debug() uses logFormatter.formatDebug()', () => {
      const debugFormatter = Sinon.spy((msg: string) => msg);
      const formatter = {
        formatDebug: debugFormatter,
      };
      const logger = new Logger(formatter as unknown as LogFormatter, makeDuplexLogStream());

      logger.debug('example');

      expect(debugFormatter).to.have.been.calledOnceWithExactly('example');
    });
    it('warn() uses logFormatter.formatWarn()', () => {
      const warnFormatter = Sinon.spy((msg: string) => msg);
      const formatter = {
        formatWarn: warnFormatter,
      };
      const logger = new Logger(formatter as unknown as LogFormatter, makeDuplexLogStream());

      logger.warn('example');

      expect(warnFormatter).to.have.been.calledOnceWithExactly('example');
    });
    it('error() uses logFormatter.formatError()', () => {
      const errorFormatter = Sinon.spy((msg: string) => msg);
      const formatter = {
        formatError: errorFormatter,
      };
      const logger = new Logger(formatter as unknown as LogFormatter, makeDuplexLogStream());

      logger.error('example');

      expect(errorFormatter).to.have.been.calledOnceWithExactly('example');
    });
    it('fatal() uses logFormatter.formatFatal()', () => {
      const fatalFormatter = Sinon.spy((msg: string) => msg);
      const formatter = {
        formatFatal: fatalFormatter,
      };
      const logger = new Logger(formatter as unknown as LogFormatter, makeDuplexLogStream());

      logger.fatal('example');

      expect(fatalFormatter).to.have.been.calledOnceWithExactly('example');
    });
  });
  it('Calling any of the logging methods writes formatted message to log stream', async () => {
    const logStream = makeDuplexLogStream();
    const logger = new Logger({
      formatInfo: (msg: string) => `formatted:${msg}`,
    } as LogFormatter, logStream);

    logger.info('message');

    const readData = await waitForAnyData(logStream);

    expect(readData).to.equal('formatted:message');
  });
});
