import Hall from '../../../domain/hall';
import SeatLayout from '../../../domain/seat-layout';

interface DummmyHallFactoryInput {
  id?: string,
  name?: string,
  layout?: SeatLayout,
}

export default function makeDummyHall(
  input: DummmyHallFactoryInput = defaultDummyHallFactoryInput,
): Hall {
  const { id, name, layout } = {
    ...defaultDummyHallFactoryInput,
    ...input,
  };
  return new Hall(id as string, name as string, layout as SeatLayout);
}

const defaultDummyHallFactoryInput: DummmyHallFactoryInput = {
  id: 'example hall id',
  name: 'example hall',
  layout: new SeatLayout(),
};
