export type JSONParserSchema = {
  [k: string]: ParserAllowedValue | JSONParserSchema;
};

export type ParserAllowedValue = (target: any) => boolean | [JSONParserSchema, any[]];
