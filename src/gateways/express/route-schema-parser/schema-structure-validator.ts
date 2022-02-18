import { JSONParserSchema } from './types/json-parser-schema';
import { ParserAllowedValues } from './types/parser-allowed-values';
import flattenStructure from './utils/flatten-structure';

export default class SchemaStructureValidator {
  private flatSchema: Map<string, ParserAllowedValues>;

  constructor(schema: JSONParserSchema) {
    this.flatSchema = flattenStructure(schema);
  }

  public isStructurallyValid(target: Record<string, any>): boolean {
    const flatTarget = flattenStructure(target);
    if (flatTarget.size !== this.flatSchema.size) return false;
    // eslint-disable-next-line no-restricted-syntax
    for (const [expectedKey, valueCheck] of this.flatSchema.entries()) {
      if (!flatTarget.has(expectedKey) || !valueCheck(flatTarget.get(expectedKey))) {
        return false;
      }
    }
    return true;
  }
}
