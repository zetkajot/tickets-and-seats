import Event from '../../domain/event';
import Hall from '../../domain/hall';
import SeatLayout from '../../domain/seat-layout';
import ReadableSeatLayoutFactory, { ReadableSeatLayout } from '../../utils/readable-seat-layout';
import UseCase from '../use-case';

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
    const event = await this.adaptedDataVendor.findUniqueEvent(eventId);
    const hall = await this.adaptedDataVendor.findUniqueRelatedHall(event.hallId);
    const [reservedSeats, freeSeats] = this.getReservedAndFreeSeats(event, hall);

    return {
      eventId: event.id,
      hallId: hall.id,
      reservedSeats: ReadableSeatLayoutFactory.fromSeatLayout(reservedSeats),
      freeSeats: ReadableSeatLayoutFactory.fromSeatLayout(freeSeats),
    };
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
