export default function makeSaveQuery(
  tableName: string,
  parameters: { [k: string]: any },
): string {
  if (Object.entries(parameters).length === 0) {
    throw new Error('Insert query requires at least one parameter!');
  }
  const fields = makeFields(parameters);
  const values = makeValues(parameters);
  const updateClause = makeUpdateClause(parameters);

  return `INSERT INTO ${tableName} (${fields}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updateClause};`;
}

function makeFields(parameters: { [k: string]: any }): string {
  return Object.keys(parameters)
    .join(', ');
}

function makeValues(parameters: { [k: string]: any }): string {
  return Object.values(parameters)
    .map((value) => convertValue(value))
    .join(', ');
}

function convertValue(value: any): string {
  if (typeof value.getMonth === 'function') return convertValue(value.getTime());
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value)) return convertValue(JSON.stringify(value));
  return `${value}`;
}

function makeUpdateClause(parameters: { [k: string]: any }): string {
  return Object.keys(parameters)
    .map((key) => `${key} = VALUES(${key})`)
    .join(', ');
}
