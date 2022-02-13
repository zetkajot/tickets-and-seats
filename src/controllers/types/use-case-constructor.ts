import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import UseCase from '../../use-cases/use-case';

export type UseCaseConstructor<Input, Output> = {
  new(storageVendor: CombinedStorageVendor): UseCase<Input, Output>;
};
