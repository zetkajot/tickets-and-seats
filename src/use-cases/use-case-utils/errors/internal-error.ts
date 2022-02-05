import Logger from '../../../utils/logger/logger';

export default class InternalError extends Error {
  constructor(
    public readonly subtype: InternalErrorSubtype,
    private underlyingError: Error,
    private logger?: Logger,
  ) {
    super();
    this.message = 'Internal Error Occured! Please contact sys-admin!';
    this.name = 'Internal Error';
    if (this.logger) {
      this.log();
    }
  }

  private log() {
    (this.logger as Logger).fatal(
      `Internal Error thrown beacause of ${this.underlyingError.name} - ${this.underlyingError.message}\nStack:${this.stack}\n`,
    );
  }

  public static withLogger(logger: Logger, subtype: InternalErrorSubtype, underlyingError: Error) {
    return new InternalError(subtype, underlyingError, logger);
  }
}

export enum InternalErrorSubtype {
  STORAGE_ERROR = 3001,
  UNKNOWN_ERROR,
}
