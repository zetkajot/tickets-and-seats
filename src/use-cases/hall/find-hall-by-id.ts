import ReadableSeatLayoutFactory from '../../utils/readable-seat-layout';
import UseCase from '../use-case';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import tryFindingEntityData from '../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryReconstructing from '../use-case-utils/try-catch-shorthands/try-reconstructing';
import reconstructHall from '../use-case-utils/reconstructors/reconstruct-hall';
import Hall from '../../domain/hall';

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
    const hallData = await this.findHallData(hallId);
    const hall = <Hall> tryReconstructing(reconstructHall, hallData);

    const readableLayout = ReadableSeatLayoutFactory.fromSeatLayout(hall.layout);

    return {
      hallId: hall.id,
      hallName: hall.name,
      seatLayout: readableLayout,
    };
  }

  private async findHallData(hallId: string): Promise<StoredHallData> {
    const hallData = <StoredHallData> (await tryFindingEntityData.customized({
      allowEmpty: false,
      related: false,
      unique: true,
    })(this.dataVendor.findHall.bind(this.dataVendor), { id: hallId }))[0];

    return hallData;
  }
}
