import { StoredEventData } from '../../../storage-vendors/event-storage-vendor';

export default function sanitizeEventData(data: Partial<StoredEventData>): Record<string, any> {
  const sanitizedData: Record<string, any> = data;
  Object.entries(data).forEach(([name, value]) => {
    if (name === 'startsAt') sanitizedData.startsAt = (value as Date).getTime();
    if (name === 'endsAt') sanitizedData.endsAt = (value as Date).getTime();
    if (name === 'reservedSeats') sanitizedData.reservedSeats = JSON.stringify(value);
    if (value === undefined) delete sanitizedData[name as keyof typeof data];
  });
  return sanitizedData;
}
