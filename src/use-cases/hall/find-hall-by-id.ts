import ReadableSeatLayoutFactory from '../../utils/readable-seat-layout';
import UseCase from '../use-case';

type ReadableSeatLayout = {
  seatNo: number,
  seatPosition: {
    x: number,
    y: number
  }
}[];

type Input = {
  hallId: string
};

type Output = {
  hallId: string
  hallName: string,
  seatLayout: ReadableSeatLayout,
};

export default class FindHallById extends UseCase<Input, Output> {
  async execute({ hallId }: Input): Promise<Output> {
    const hall = await this.adaptedDataVendor.findUniqueHall(hallId);
    return {
      hallId: hall.id,
      hallName: hall.name,
      seatLayout: ReadableSeatLayoutFactory.fromSeatLayout(hall.layout),
    };
  }
}
