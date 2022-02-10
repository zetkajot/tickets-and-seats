import CombinedStorageVendor from '../../../storage-vendors/combined-storage-vendor';

export type QueryFactories = {
  [Key in keyof CombinedStorageVendor]: (data: object) => string;
};
