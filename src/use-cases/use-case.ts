import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';

export default abstract class UseCase<Input, Output> {
  constructor(protected dataVendor: CombinedStorageVendor) {}
  abstract execute(input: Input): Promise<Output>;
}
