import UseCase from '../use-case';

type Input = {
  eventId: string,
};

type Output = {
  eventId: string,
  name: string,
  hallId: string,
};

export default class DeleteEvent extends UseCase<Input, Output> {
  async execute({ eventId }: Input): Promise<Output> {
    const targetEvent = await this.adaptedDataVendor.findUniqueEvent(eventId);
    await this.adaptedDataVendor.deleteEvent(targetEvent);
    return {
      eventId: targetEvent.id,
      hallId: targetEvent.hallId,
      name: targetEvent.name,
    };
  }
}
