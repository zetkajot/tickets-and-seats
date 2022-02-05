import { stdout } from 'process';
import defaultFormatter from '../utils/logger/default-formatter';
import Logger from '../utils/logger/logger';

export default class ErrorFactory {
  private constructor() {
    // intentionally empty
  }

  public static setDefaultLogger(): void {
    this.logger = new Logger(defaultFormatter, stdout);
  }

  private static logger: Logger;

  private static instance: ErrorFactory;

  public static setLogger(logger: Logger): void {
    this.logger = logger;
  }

  static getInstance(): ErrorFactory {
    if (!this.instance) {
      this.instance = new ErrorFactory();
    }
    return this.instance;
  }

  // eslint-disable-next-line class-methods-use-this
  makeError<
  T extends Error,
  U extends { new(...args: any[]): T },
  >(ErrorConstructor: U, ...args: ConstructorParameters<U>): T {
    if ('withLogger' in ErrorConstructor) {
      return (ErrorConstructor as unknown as LoggerInjectableError<T>)
        .withLogger(ErrorFactory.logger, ...args);
    }
    return new ErrorConstructor(...args);
  }
}

interface LoggerInjectableError<T extends Error> {
  new(...args: any[]): T;
  withLogger(logger: Logger, ...args: any[]): T;
}
