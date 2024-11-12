import { Database } from '@/types/database';

export type Town = Database['public']['Tables']['towns']['Row'];

export type TownSummary = Database['public']['Views']['town_help_request_summary']['Row'];
