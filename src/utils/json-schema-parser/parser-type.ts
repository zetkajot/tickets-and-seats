const ParserType = {
  NUMBER: (value: any) => typeof value === 'number',
  STRING: (value: any) => typeof value === 'string',
  OBJECT: (value: any) => typeof value === 'object',
  DATE: (value: any) => Number.isNaN(Date.parse(value)),
  BOOLEAN: (value: any) => typeof value === 'boolean',
  ARRAY: (value: any) => Array.isArray(value),
};

export default ParserType;
