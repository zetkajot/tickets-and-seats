import { ConverterFactorySettings } from '../make-input-converter';

const toFindEventsInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'name',
    optional: true,
  },
  {
    argumentName: 'hallId',
    optional: true,
  },
];

export default toFindEventsInputTemplate;
