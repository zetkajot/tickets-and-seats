import { ConverterFactorySettings } from '../make-input-converter';

const toFindEventByIdInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'id',
    desiredName: 'eventId',
  },
];

export default toFindEventByIdInputTemplate;
