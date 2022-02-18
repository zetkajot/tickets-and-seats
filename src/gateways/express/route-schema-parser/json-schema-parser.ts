import ParserError from './errors/parser-error';
import SchemaStructureValidator from './schema-structure-validator';
import { JSONParserSchema } from './types/json-parser-schema';

type KeyMatcher = ((key: string) => boolean);
type PropertyChanger = ((key: string, value: any) => [newKey: string, newValue: any]);
type ValueMatcher = ((value: any)=> boolean);
type KeyValuePairMatcher = ((key: string, value: any) => boolean);

export default class JSONSchemaParser<T> {
  private structureValidator: SchemaStructureValidator;

  private keyMatchers: Map<KeyMatcher, PropertyChanger> = new Map();

  private valueMatchers: Map<ValueMatcher, PropertyChanger> = new Map();

  private keyValuePairMatchers: Map<KeyValuePairMatcher, PropertyChanger> = new Map();

  constructor(schema: JSONParserSchema) {
    this.structureValidator = new SchemaStructureValidator(schema);
  }

  parse(json: string): T {
    const parsedJSON = this.tryParsingJSON(json);
    if (!this.structureValidator.isStructurallyValid(parsedJSON)) {
      throw new ParserError();
    }
    this.change(parsedJSON);
    return parsedJSON as unknown as T;
  }

  // eslint-disable-next-line class-methods-use-this
  private tryParsingJSON(target: string): object {
    try {
      return JSON.parse(target);
    } catch {
      throw new ParserError();
    }
  }

  private change(target: Record<string, any>) {
    Object.entries(target).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.change(target[key]);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const [matcher, changeBehaviour] of this.valueMatchers.entries()) {
          if (matcher(value)) this.changeProperty(target, key, changeBehaviour);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const [matcher, changeBehaviour] of this.keyMatchers.entries()) {
          if (matcher(key)) this.changeProperty(target, key, changeBehaviour);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const [matcher, changeBehaviour] of this.keyValuePairMatchers.entries()) {
          if (matcher(key, value)) this.changeProperty(target, key, changeBehaviour);
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private changeProperty(
    target: Record<string, any>,
    key: string,
    changeBehaviour: PropertyChanger,
  ) {
    const [newKey, newValue] = changeBehaviour(key, target[key]);
    const targetRef = target;
    delete targetRef[key];
    targetRef[newKey] = newValue;
  }

  forKey(
    matchingName: string | ((keyName: string) => boolean),
    behaviour: (keyName: string, keyValue: any) => [newKeyName: string, newKeyValue: any],
  ): void {
    const matcher = typeof matchingName === 'function'
      ? matchingName
      : (keyName: string) => keyName === matchingName;
    this.keyMatchers.set(matcher, behaviour);
  }

  forValue(
    matchingValue: any | ((keyValue: any) => boolean),
    behaviour: (keyName: string, keyValue: any) => [newKeyName: string, newKeyValue: any],
  ): void {
    const matcher = typeof matchingValue === 'function'
      ? matchingValue
      : (keyValue: any) => keyValue === matchingValue;
    this.valueMatchers.set(matcher, behaviour);
  }

  forKeyValuePair(
    matchingPair: [name: string, value: any] | ((name: string, value: any) => boolean),
    behaviour: (keyName: string, keyValue: any) => [newKeyName: string, newKeyValue: any],
  ): void {
    const matcher = typeof matchingPair === 'function'
      ? matchingPair
      : (name: string, value: any) => matchingPair[0] === name && matchingPair[1] === value;
    this.keyValuePairMatchers.set(matcher, behaviour);
  }

  reset(): void {
    this.keyMatchers = new Map();
    this.valueMatchers = new Map();
    this.keyValuePairMatchers = new Map();
  }
}
