export default interface LogFormatter {
  formatInfo(msg: string): string;
  formatWarn(msg: string): string;
  formatError(msg: string): string;
  formatFatal(msg: string): string;
  formatDebug(msg: string): string;
}
