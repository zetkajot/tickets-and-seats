import { JSONParserSchema, ParserAllowedValue } from './types/json-parser-schema';
import flattenStructure from './utils/flatten-structure';

export default class SchemaStructureValidator {
  private flatSchema: Map<string, ParserAllowedValue>;

  constructor(schema: JSONParserSchema) {
    this.flatSchema = flattenStructure(schema);
  }

  public isStructurallyValid(target: Record<string, any>): boolean {
    const flatTarget = flattenStructure(target);
    if (flatTarget.size !== this.flatSchema.size) return false;
    // eslint-disable-next-line no-restricted-syntax
    for (const [expectedKey, valueChecker] of this.flatSchema.entries()) {
      const targetValue = flatTarget.get(expectedKey);
      const valueCheckResult = valueChecker(targetValue);
      if (targetValue === undefined || valueCheckResult === false) return false;
      if (typeof valueCheckResult === 'object' && !this.checkNestedSchema(...valueCheckResult)) return false;
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  private checkNestedSchema(schema: JSONParserSchema, schemaEntries: any[]): boolean {
    const nestedValidator = new SchemaStructureValidator(schema);
    return schemaEntries.every((value) => nestedValidator.isStructurallyValid(value));
  }
}
