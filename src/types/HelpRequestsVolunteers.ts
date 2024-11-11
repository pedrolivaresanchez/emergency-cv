import { Database } from './database';

export type HRV = Database['public']['Tables']['help_requests_volunteers']['Row'];
export type HRVUpdate = Omit<Database['public']['Tables']['help_requests_volunteers']['Update'], 'id'> &
  Pick<Database['public']['Tables']['help_requests_volunteers']['Row'], 'id'>;
