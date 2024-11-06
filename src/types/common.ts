import { Database } from './database';

export type TownType = {
  id: string;
  name: string;
};

export type SupabaseTown = Database['public']['Tables']['towns']['Row'];
