export default function makeSaveQuery(
  tableName: string,
  parameters: { [k: string]: any },
): string {
  if (Object.entries(parameters).length === 0) {
    throw new Error('Insert query requires at least one parameter!');
  }
  const fields = makeFields(parameters);
  const values = makeValues(parameters);

  return `INSERT INTO ${tableName} (${fields}) VALUES (${values});`;
}

function makeFields(parameters: { [k: string]: any }): string {
  return Object.keys(parameters)
    .join(', ');
}

function makeValues(parameters: { [k: string]: any }): string {
  return Object.values(parameters)
    .map((value) => (typeof value === 'string' ? `'${value}'` : `${value}`))
    .join(', ');
}
