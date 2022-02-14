import { ConverterFactorySettings } from '../make-input-converter';

const toValidateTicketInputTemplate: ConverterFactorySettings = [
  {
    argumentName: 'id',
    desiredName: 'ticketId',
  },
];

export default toValidateTicketInputTemplate;
