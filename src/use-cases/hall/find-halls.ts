import UseCase from '../use-case';

type Input = {
  name?: string,
};
type Output = {
  hallId: string,
  hallName: string,
}[];

export default class FindHalls extends UseCase<Input, Output> {
  async execute(input: Input): Promise<Output> {
    const foundHalls = await this.adaptedDataVendor.findHalls(input);
    return foundHalls.map((hall) => ({
      hallId: hall.id,
      hallName: hall.name,
    }));
  }
}
