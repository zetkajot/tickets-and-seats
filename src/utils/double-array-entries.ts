export default function doubleArrayEntries(array: any[]): any[] {
  const resultingArray = Array(array.length * 2);
  array.forEach((val, idx) => {
    resultingArray[idx * 2] = val;
    resultingArray[idx * 2 + 1] = val;
  });
  return resultingArray;
}
