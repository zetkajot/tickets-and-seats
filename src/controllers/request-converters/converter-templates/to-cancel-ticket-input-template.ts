import { ConverterFactorySettings } from '../make-input-converter';

const toCancelTicketInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'id',
    desiredName: 'ticketId',
  },
];

export default toCancelTicketInputTemplate;
