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

const useCaseConstructorLibrary = {
  FindEventById,
  FindEvents,
  CreateEvent,
  OpenEvent,
  CloseEvent,
  DeleteEvent,
  GetSeatsInfo,
  FindHallById,
  FindHalls,
  CreateHall,
  DeleteHall,
  IssueTicket,
  ValidateTicket,
  CancelTicket,
};

export default useCaseConstructorLibrary;
