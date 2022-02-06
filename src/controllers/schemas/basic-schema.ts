import CloseEvent from '../../use-cases/event/close-event';
import CreateEvent from '../../use-cases/event/create-event';
import FindEventById from '../../use-cases/event/find-event-by-id';
import GetSeatsInfo from '../../use-cases/event/get-seats-info';
import OpenEvent from '../../use-cases/event/open-event';
import CreateHall from '../../use-cases/hall/create-hall';
import FindHallById from '../../use-cases/hall/find-hall-by-id';
import IssueTicket from '../../use-cases/ticket/issue-ticket';
import toCloseEventInputTemplate from '../request-converters/converter-templates/to-close-event-input-template';
import toCreateEventInputTemplate from '../request-converters/converter-templates/to-create-event-input-template';
import toCreateHallInputTemplate from '../request-converters/converter-templates/to-create-hall-input-template';
import toFindEventByIdInputTemplate from '../request-converters/converter-templates/to-find-event-by-id-input-template';
import toFindHallByIdInputTemplate from '../request-converters/converter-templates/to-find-hall-by-id-input-template';
import toGetSeatsInfoInputTemplate from '../request-converters/converter-templates/to-get-seats-info-input-template';
import toIssueTicketInputTemplate from '../request-converters/converter-templates/to-issue-ticket-input-template';
import toOpenEventInputTemplate from '../request-converters/converter-templates/to-open-event-input-template';
import makeInputConverter from '../request-converters/make-input-converter';
import { ActionSchema } from '../types/action-schema';

const basicSchema: ActionSchema = [
  {
    actionName: 'create-event',
    targetUseCase: CreateEvent,
    convertRequestToInput: makeInputConverter(...toCreateEventInputTemplate),
  },
  {
    actionName: 'find-event-by-id',
    targetUseCase: FindEventById,
    convertRequestToInput: makeInputConverter(...toFindEventByIdInputTemplate),
  },
  {
    actionName: 'close-event',
    targetUseCase: CloseEvent,
    convertRequestToInput: makeInputConverter(...toCloseEventInputTemplate),
  },
  {
    actionName: 'open-event',
    targetUseCase: OpenEvent,
    convertRequestToInput: makeInputConverter(...toOpenEventInputTemplate),
  },
  {
    actionName: 'get-event-seat-info',
    targetUseCase: GetSeatsInfo,
    convertRequestToInput: makeInputConverter(...toGetSeatsInfoInputTemplate),
  },
  {
    actionName: 'issue-ticket',
    targetUseCase: IssueTicket,
    convertRequestToInput: makeInputConverter(...toIssueTicketInputTemplate),
  },
  {
    actionName: 'create-hall',
    targetUseCase: CreateHall,
    convertRequestToInput: makeInputConverter(...toCreateHallInputTemplate),
  },
  {
    actionName: 'find-hall-by-id',
    targetUseCase: FindHallById,
    convertRequestToInput: makeInputConverter(...toFindHallByIdInputTemplate),
  },
];

export default basicSchema;
