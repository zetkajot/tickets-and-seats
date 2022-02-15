import { InputSchemaType } from './input-schema';

export type ExtractRealTypeFromSchemaType<T extends
InputSchemaType.DATE |
InputSchemaType.NUMBER |
InputSchemaType.OBJECT |
InputSchemaType.STRING,
> =
T extends InputSchemaType.DATE ? Date :
  T extends InputSchemaType.NUMBER ? number :
    T extends InputSchemaType.OBJECT ? object :
      string;
