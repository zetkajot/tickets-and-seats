import { ConverterFactorySettings } from '../make-input-converter';

const toDeleteEventInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'id',
    desiredName: 'eventId',
  },
];

export default toDeleteEventInputTemplate;
