import CloseEvent from '../../use-cases/event/close-event';
import CreateEvent from '../../use-cases/event/create-event';
import DeleteEvent from '../../use-cases/event/delete-event';
import FindEventById from '../../use-cases/event/find-event-by-id';
import FindEvents from '../../use-cases/event/find-events';
import GetSeatsInfo from '../../use-cases/event/get-seats-info';
import OpenEvent from '../../use-cases/event/open-event';
import CreateHall from '../../use-cases/hall/create-hall';
import DeleteHall from '../../use-cases/hall/delete-hall';
import FindHallById from '../../use-cases/hall/find-hall-by-id';
import FindHalls from '../../use-cases/hall/find-halls';
import CancelTicket from '../../use-cases/ticket/cancel-ticket';
import IssueTicket from '../../use-cases/ticket/issue-ticket';
import ValidateTicket from '../../use-cases/ticket/validate-ticket';
import toCancelTicketInputTemplate from '../request-converters/converter-templates/to-cancel-ticket-input-template';
import toCloseEventInputTemplate from '../request-converters/converter-templates/to-close-event-input-template';
import toCreateEventInputTemplate from '../request-converters/converter-templates/to-create-event-input-template';
import toCreateHallInputTemplate from '../request-converters/converter-templates/to-create-hall-input-template';
import toDeleteEventInputTemplate from '../request-converters/converter-templates/to-delete-event-input-template';
import toDeleteHallInputTemplate from '../request-converters/converter-templates/to-delete-hall-input-template';
import toFindEventByIdInputTemplate from '../request-converters/converter-templates/to-find-event-by-id-input-template';
import toFindEventsInputTemplate from '../request-converters/converter-templates/to-find-events-input-template';
import toFindHallByIdInputTemplate from '../request-converters/converter-templates/to-find-hall-by-id-input-template';
import toFindHallsInputTemplate from '../request-converters/converter-templates/to-find-halls-input-template';
import toGetSeatsInfoInputTemplate from '../request-converters/converter-templates/to-get-seats-info-input-template';
import toIssueTicketInputTemplate from '../request-converters/converter-templates/to-issue-ticket-input-template';
import toOpenEventInputTemplate from '../request-converters/converter-templates/to-open-event-input-template';
import toValidateTicketInputTemplate from '../request-converters/converter-templates/to-validate-ticket-input-template';
import makeInputConverter from '../request-converters/make-input-converter';
import { ActionSchema } from '../types/action-schema';

const defaultActionSchema: ActionSchema = {
  createEvent: {
    UseCase: CreateEvent,
    converter: makeInputConverter(...toCreateEventInputTemplate),
  },
  findEventById: {
    UseCase: FindEventById,
    converter: makeInputConverter(...toFindEventByIdInputTemplate),
  },
  findEvents: {
    UseCase: FindEvents,
    converter: makeInputConverter(...toFindEventsInputTemplate),
  },
  getEventSeatsInfo: {
    UseCase: GetSeatsInfo,
    converter: makeInputConverter(...toGetSeatsInfoInputTemplate),
  },
  openEvent: {
    UseCase: OpenEvent,
    converter: makeInputConverter(...toOpenEventInputTemplate),
  },
  closeEvent: {
    UseCase: CloseEvent,
    converter: makeInputConverter(...toCloseEventInputTemplate),
  },
  deleteEvent: {
    UseCase: DeleteEvent,
    converter: makeInputConverter(...toDeleteEventInputTemplate),
  },
  createHall: {
    UseCase: CreateHall,
    converter: makeInputConverter(...toCreateHallInputTemplate),
  },
  findHalls: {
    UseCase: FindHalls,
    converter: makeInputConverter(...toFindHallsInputTemplate),
  },
  findHallById: {
    UseCase: FindHallById,
    converter: makeInputConverter(...toFindHallByIdInputTemplate),
  },
  deleteHall: {
    UseCase: DeleteHall,
    converter: makeInputConverter(...toDeleteHallInputTemplate),
  },
  issueTicket: {
    UseCase: IssueTicket,
    converter: makeInputConverter(...toIssueTicketInputTemplate),
  },
  validateTicket: {
    UseCase: ValidateTicket,
    converter: makeInputConverter(...toValidateTicketInputTemplate),
  },
  cancelTicket: {
    UseCase: CancelTicket,
    converter: makeInputConverter(...toCancelTicketInputTemplate),
  },
};

export default defaultActionSchema;
