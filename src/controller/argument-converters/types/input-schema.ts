export type InputSchema = InputSchemaEntry[];

export type InputSchemaEntry = {
  argName: string;
  desiredName?: string;
  required?: boolean;
  type?: InputSchemaType;
};

export enum InputSchemaType {
  STRING,
  NUMBER,
  DATE,
  OBJECT,
}
