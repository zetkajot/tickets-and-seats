import EventStorageVendor from './event-storage-vendor';
import HallStorageVendor from './hall-storage-vendor';
import TicketStorageVendor from './ticket-storage-vendor';

export default interface CombinedStorageVendor
  extends EventStorageVendor, HallStorageVendor, TicketStorageVendor {}
