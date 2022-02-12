import UseCase from '../use-case';

type Input = {
  hallId: string;
};

type Output = {
  hallId: string,
  hallName: string,
};

export default class DeleteHall extends UseCase<Input, Output> {
  async execute({ hallId }: Input): Promise<Output> {
    const targetHall = await this.adaptedDataVendor.findUniqueHall(hallId);
    await this.adaptedDataVendor.deleteHall(targetHall);
    return {
      hallId,
      hallName: targetHall.name,
    };
  }
}
