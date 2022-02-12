import UseCase from '../use-case';

type Input = {
  name?: string;
  hallId?: string,
};

type Output = {
  eventId: string;
  eventName: string;
  hallId: string,
  startingDate: Date,
  endingDate: Date,
  isOpen: boolean,
}[];

export default class FindEvents extends UseCase<Input, Output> {
  async execute(input: Input): Promise<Output> {
    const matchingEventSet = await this.adaptedDataVendor.findEvents(input);

    return matchingEventSet.map((event) => ({
      eventId: event.id,
      eventName: event.name,
      hallId: event.hallId,
      isOpen: event.isOpenForReservations,
      endingDate: event.endsAt,
      startingDate: event.startsAt,
    }));
  }
}
