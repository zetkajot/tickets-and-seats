import Event from '../../domain/event';
import Hall from '../../domain/hall';
import SeatLayout from '../../domain/seat-layout';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import ReadableSeatLayoutFactory, { ReadableSeatLayout } from '../../utils/readable-seat-layout';
import UseCase from '../use-case';
import reconstructEvent from '../use-case-utils/reconstructors/reconstruct-event';
import reconstructHall from '../use-case-utils/reconstructors/reconstruct-hall';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';

type Input = {
  eventId: string,
};

type Output = {
  eventId: string,
  hallId: string,
  reservedSeats: ReadableSeatLayout,
  freeSeats: ReadableSeatLayout,
};

export default class GetSeatsInfo extends UseCase<Input, Output> {
  async execute({ eventId }: Input): Promise<Output> {
    const [event, hall] = await this.findEventAndHall(eventId);
    const [reservedSeats, freeSeats] = this.getReservedAndFreeSeats(event, hall);

    return {
      eventId: event.id,
      hallId: hall.id,
      reservedSeats: ReadableSeatLayoutFactory.fromSeatLayout(reservedSeats),
      freeSeats: ReadableSeatLayoutFactory.fromSeatLayout(freeSeats),
    };
  }

  private async findEventAndHall(eventId: string): Promise<[Event, Hall]> {
    const eventData = <StoredEventData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: false,
      unique: true,
    })(this.dataVendor.findEvent.bind(this.dataVendor), { id: eventId }))[0];

    const relatedHall = await this.findRelatedHall(eventData.hallId);

    return [tryReconstructing(reconstructEvent, eventData, relatedHall), relatedHall];
  }

  private async findRelatedHall(hallId: string): Promise<Hall> {
    const hallData = <StoredHallData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: true,
      unique: true,
    })(this.dataVendor.findHall.bind(this.dataVendor), { id: hallId }))[0];

    return tryReconstructing(reconstructHall, hallData);
  }

  // eslint-disable-next-line class-methods-use-this
  private getReservedAndFreeSeats(
    event: Event,
    hall: Hall,
  ): [reserved: SeatLayout, free: SeatLayout] {
    const freeSeats = new SeatLayout();
    const reservedSeats = new SeatLayout();
    hall.layout.layout.forEach(({ seatNo, position }) => {
      if (event.reservedSeats.includes(seatNo)) {
        reservedSeats.addSeat(seatNo, position);
      } else {
        freeSeats.addSeat(seatNo, position);
      }
    });

    return [reservedSeats, freeSeats];
  }
}
