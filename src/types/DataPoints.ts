import { Database } from '@/types/database';

export type CollectionPointData = Database['public']['Tables']['collection_points']['Row'];

export type DeliveryPointData = Database['public']['Tables']['delivery_points']['Row'];
export type DeliveryPointInsert = Database['public']['Tables']['delivery_points']['Insert'];

export function isCoordinates(coords: unknown): coords is { lat: number; lon: number } {
  return typeof coords === 'object' && coords !== null && 'lat' in coords && 'lon' in coords;
}
