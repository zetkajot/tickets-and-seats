export default function countOccurences(baseString: string, regexp: RegExp): number {
  let occurences = 0;
  // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars
  for (const match of baseString.matchAll(regexp)) { occurences += 1; }

  return occurences;
}
