import Logger from '../../../utils/logger/logger';

export default class DiscrepancyError extends Error {
  name: string = 'Discrepancy Error';

  constructor(public readonly underlyingError: Error, private logger?: Logger) {
    super();
    this.message = 'Discrepancy Error occured. Contact sys-admin!';

    if (logger) {
      this.log();
    }
  }

  public static withLogger(logger: Logger, underlyingError: Error) {
    return new DiscrepancyError(underlyingError, logger);
  }

  private log() {
    (this.logger as Logger).error(
      `DiscrepancyError thrown beacause of ${this.underlyingError.name} - ${this.underlyingError.message}\nStack:${this.stack}\n`,
    );
  }
}
