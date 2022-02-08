import { randomUUID } from 'crypto';
import Hall from '../../domain/hall';
import ReadableSeatLayoutFactory, { ReadableSeatLayout } from '../../utils/readable-seat-layout';
import UseCase from '../use-case';
import tryInstantiating from '../use-case-utils/try-catch-shorthands/try-instantiating';

type Input = {
  hallName: string,
  seatLayout: ReadableSeatLayout,
};

type Output = Input & { hallId: string };

export default class CreateHall extends UseCase<Input, Output> {
  async execute({ hallName, seatLayout }: Input): Promise<Output> {
    const convertedSeatLayout = ReadableSeatLayoutFactory.toSeatLayout(seatLayout);
    const hall = <Hall> tryInstantiating(Hall, randomUUID(), hallName, convertedSeatLayout);
    await this.adaptedDataVendor.saveHall(hall);
    return {
      hallName: hall.name,
      hallId: hall.id,
      seatLayout,
    };
  }
}
