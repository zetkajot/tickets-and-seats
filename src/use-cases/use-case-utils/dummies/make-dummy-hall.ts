import Hall from '../../../domain/hall';
import SeatLayout from '../../../domain/seat-layout';

interface DummmyHallFactoryInput {
  id?: string,
  name?: string,
  layout?: SeatLayout,
  requiredSeats?: number[],
}

export default function makeDummyHall(
  input: DummmyHallFactoryInput = defaultDummyHallFactoryInput,
): Hall {
  const {
    id, name, layout, requiredSeats,
  } = {
    ...defaultDummyHallFactoryInput,
    ...input,
  };
  const hall = new Hall(id as string, name as string, layout as SeatLayout);
  if ((requiredSeats as number[]).length > 0) {
    (requiredSeats as number[]).forEach(
      (seatNo) => (hall.hasSeat(seatNo) ? null : hall.layout.addSeat(seatNo, [0, 0])),
    );
  }
  return hall;
}

const defaultDummyHallFactoryInput: DummmyHallFactoryInput = {
  id: 'example hall id',
  name: 'example hall',
  layout: new SeatLayout(),
  requiredSeats: [],
};
