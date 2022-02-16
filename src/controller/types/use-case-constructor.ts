import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import UseCase from '../../use-cases/use-case';

export type UseCaseConstructor<I, O> = {
  new(sv: CombinedStorageVendor): UseCase<I, O>
};
