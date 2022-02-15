export default class ControllerSchemaError extends Error {
  constructor(public readonly subtype: ControllerSchemaErrorSubtype) {
    super();
    this.name = 'Controller Schema Error';
    this.message = controllerSchemaErrorMessages[subtype];
  }
}

export enum ControllerSchemaErrorSubtype {
  MISSING_SCHEMA,
  INVALID_JSON,
  INVALID_STRUCTURE,
  UNKNOWN_TYPE,
  UNKNOWN_USECASE,
}

const controllerSchemaErrorMessages: { [K in ControllerSchemaErrorSubtype]: string } = {
  [ControllerSchemaErrorSubtype.INVALID_JSON]: 'Provied controller schema is not a valid JSON!',
  [ControllerSchemaErrorSubtype.MISSING_SCHEMA]: 'Controller schema was not found!',
  [ControllerSchemaErrorSubtype.INVALID_STRUCTURE]: 'Controller schema has invalid structure!',
  [ControllerSchemaErrorSubtype.UNKNOWN_TYPE]: 'Controller schema references unknown type!',
  [ControllerSchemaErrorSubtype.UNKNOWN_USECASE]: 'Controller schema references unknown use case!',
};
