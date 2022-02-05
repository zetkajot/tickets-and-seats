import { Writable } from 'stream';
import LogFormatter from './log-formatter';

export default class Logger {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private logFormatter: LogFormatter, private logStream: Writable) {}

  public info(msg: string) {
    this.log(this.logFormatter.formatInfo, msg);
  }

  public warn(msg: string) {
    this.log(this.logFormatter.formatWarn, msg);
  }

  public error(msg: string) {
    this.log(this.logFormatter.formatError, msg);
  }

  public fatal(msg: string) {
    this.log(this.logFormatter.formatFatal, msg);
  }

  public debug(msg: string) {
    this.log(this.logFormatter.formatDebug, msg);
  }

  private log(formattingFn: (x: string)=>string, msg: string) {
    this.logStream.write(formattingFn(msg));
  }
}
