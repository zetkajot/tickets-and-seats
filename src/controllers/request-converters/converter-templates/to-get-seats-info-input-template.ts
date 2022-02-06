import { ConverterFactorySettings } from '../make-input-converter';

const toGetSeatsInfoInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'id',
    desiredName: 'eventId',
  },
];

export default toGetSeatsInfoInputTemplate;
