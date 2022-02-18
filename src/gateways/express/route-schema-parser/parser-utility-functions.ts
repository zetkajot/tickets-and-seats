export function inValues(valuesArray: Array<any>): (targetValue: any) => boolean {
  return (targetValue: any) => valuesArray.includes(targetValue);
}
export function exactValue(value: any): (targetValue: any) => boolean {
  return (targetValue: any) => targetValue === value;
}
