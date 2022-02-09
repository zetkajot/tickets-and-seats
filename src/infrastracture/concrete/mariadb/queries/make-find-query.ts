export default function makeFindQuery(
  tableName: string,
  parameters: { [k: string]: any },
): string {
  const conditions = Object.entries(parameters).length > 0 ? makeConditions(parameters) : '';
  return `SELECT * FROM ${tableName}${conditions};`;
}

function makeConditions(parameters: { [k: string]: string }): string {
  return ` WHERE ${Object.entries(parameters)
    .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`)
    .join(' AND ')}`;
}
