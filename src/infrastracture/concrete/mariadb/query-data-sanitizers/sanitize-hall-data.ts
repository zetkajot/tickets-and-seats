import { StoredHallData } from '../../../storage-vendors/hall-storage-vendor';

export default function sanitizeHallData(data: Partial<StoredHallData>): Record<string, any> {
  const sanitizedData: Record<string, any> = data;
  Object.entries(data).forEach(([name, value]) => {
    if (name === 'layout') sanitizedData.layout = JSON.stringify(value);
    if (value === undefined) delete sanitizedData[name as keyof typeof data];
  });
  return sanitizedData;
}
