import Event from '../../../domain/event';
import { StoredEventData } from '../../../infrastracture/storage-vendors/event-storage-vendor';

export default function deconstructEvent(event: Event): StoredEventData {
  return {
    id: event.id,
    endsAt: event.endsAt,
    name: event.name,
    startsAt: event.startsAt,
    reservedSeats: event.reservedSeats,
    hallId: event.hallId,
    isOpen: event.isOpenForReservations,
  };
}
