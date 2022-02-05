import LogFormatter from './log-formatter';

const defaultFormatter: LogFormatter = {
  formatDebug: (msg: string) => `[DEBUG] ${getFormatedDate()} ${msg}`,
  formatInfo: (msg: string) => `[INFO] ${getFormatedDate()} ${msg}`,
  formatWarn: (msg: string) => `[WARN] ${getFormatedDate()} ${msg}`,
  formatError: (msg: string) => `[ERROR] ${getFormatedDate()} ${msg}`,
  formatFatal: (msg: string) => `[FATAL] ${getFormatedDate()} ${msg}`,
};

function getFormatedDate(): string {
  const currentDate = new Date();
  const [day, month, year, hour, min, sec, ms] = [
    currentDate.getDay(),
    currentDate.getMonth(),
    currentDate.getFullYear(),
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getSeconds(),
    currentDate.getMilliseconds(),
  ];
  return `${day}/${month}/${year} ${hour}:${min}:${sec}:${ms}`;
}

export default defaultFormatter;
