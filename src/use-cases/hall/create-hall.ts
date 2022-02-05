import { randomUUID } from 'crypto';
import Hall from '../../domain/hall';
import ReadableSeatLayoutFactory, { ReadableSeatLayout } from '../../utils/readable-seat-layout';
import UseCase from '../use-case';
import deconstructHall from '../use-case-utils/deconstructors/deconstruct-hall';
import tryExecutingStorageQuery from '../use-case-utils/try-catch-shorthands/try-executing-storage-query';
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
    await this.saveNewHall(hall);
    return {
      hallId: hall.id,
      hallName: hall.name,
      seatLayout,
    };
  }

  private async saveNewHall(hall: Hall): Promise<void> {
    const hallData = deconstructHall(hall);
    await tryExecutingStorageQuery(this.dataVendor.saveHall.bind(this.dataVendor), hallData);
  }
}
