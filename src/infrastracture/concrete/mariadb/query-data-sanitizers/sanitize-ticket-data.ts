import { StoredTicketData } from '../../../storage-vendors/ticket-storage-vendor';

export default function sanitizeTicketData(data: Partial<StoredTicketData>): Record<string, any> {
  const sanitizedData: Record<string, any> = data;
  Object.entries(data).forEach(([name, value]) => {
    if (value === undefined) delete sanitizedData[name as keyof typeof data];
  });
  return sanitizedData;
}
