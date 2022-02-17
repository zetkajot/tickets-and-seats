export default function alternateTables(array1: any[], array2: any[]) {
  if (array1.length > array2.length) {
    throw new SyntaxError(
      'First array must the same or smaller number of entries than second array!',
    );
  }

  const resultingArray = Array(array1.length + array2.length);
  array1.forEach((val, idx) => {
    resultingArray[idx * 2] = val;
    resultingArray[idx * 2 + 1] = array2[idx];
  });
  return [...resultingArray, ...array2.slice(array1.length)];
}
