export default function makeFindQuery(
  tableName: string,
  parameters: { [k: string]: any },
): string {
  const conditions = makeConditions(parameters);
  return `SELECT * FROM ${tableName}${conditions};`;
}

function makeConditions(parameters: { [k: string]: string }): string {
  const whereConditions = `${Object.entries(parameters)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`)
    .join(' AND ')}`;
  return whereConditions.length > 0 ? ` WHERE ${whereConditions}` : '';
}
