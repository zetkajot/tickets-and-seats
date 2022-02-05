import CloseEvent from '../../use-cases/event/close-event';
import CreateEvent from '../../use-cases/event/create-event';
import FindEventById from '../../use-cases/event/find-event-by-id';
import GetSeatsInfo from '../../use-cases/event/get-seats-info';
import OpenEvent from '../../use-cases/event/open-event';
import CreateHall from '../../use-cases/hall/create-hall';
import FindHallById from '../../use-cases/hall/find-hall-by-id';
import IssueTicket from '../../use-cases/ticket/issue-ticket';
import convertToCloseEventInput from '../request-converters/convert-to-close-event-input';
import convertToCreateEventInput from '../request-converters/convert-to-create-event-input';
import convertToCreateHallInput from '../request-converters/convert-to-create-hall-input';
import convertToFindEventByIdInput from '../request-converters/convert-to-find-event-by-id-input';
import convertToFindHallByIdInput from '../request-converters/convert-to-find-hall-by-id-input';
import convertToGetSeatsInfoInput from '../request-converters/convert-to-get-seats-info-input';
import convertToIssueTicketInput from '../request-converters/convert-to-issue-ticket-input';
import convertToOpenEventInput from '../request-converters/convert-to-open-event-input';
import { ActionSchema } from '../types/action-schema';

const basicSchema: ActionSchema = [
  {
    actionName: 'create-event',
    targetUseCase: CreateEvent,
    convertRequestToInput: <any>convertToCreateEventInput,
  },
  {
    actionName: 'find-event-by-id',
    targetUseCase: FindEventById,
    convertRequestToInput: <any>convertToFindEventByIdInput,
  },
  {
    actionName: 'close-event',
    targetUseCase: CloseEvent,
    convertRequestToInput: <any>convertToCloseEventInput,
  },
  {
    actionName: 'open-event',
    targetUseCase: OpenEvent,
    convertRequestToInput: <any>convertToOpenEventInput,
  },
  {
    actionName: 'get-event-seat-info',
    targetUseCase: GetSeatsInfo,
    convertRequestToInput: <any>convertToGetSeatsInfoInput,
  },
  {
    actionName: 'issue-ticket',
    targetUseCase: IssueTicket,
    convertRequestToInput: <any>convertToIssueTicketInput,
  },
  {
    actionName: 'create-hall',
    targetUseCase: CreateHall,
    convertRequestToInput: <any>convertToCreateHallInput,
  },
  {
    actionName: 'find-hall-by-id',
    targetUseCase: FindHallById,
    convertRequestToInput: <any>convertToFindHallByIdInput,
  },
];

export default basicSchema;
