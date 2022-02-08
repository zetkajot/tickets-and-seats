import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';
import makeStorageAdapter from './storage-adapter/make-storage-adapter';
import StorageAdapter from './storage-adapter/storage-adapter';

export default abstract class UseCase<Input, Output> {
  protected adaptedDataVendor: StorageAdapter;

  constructor(dataVendor: CombinedStorageVendor) {
    this.adaptedDataVendor = makeStorageAdapter(dataVendor);
  }

  abstract execute(input: Input): Promise<Output>;
}
