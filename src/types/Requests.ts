import { Database } from './database';

export type HelpRequestType = 'necesita' | 'ofrece';
export type HelpRequestUrgencyType = 'alta' | 'media' | 'baja';
export type HelpRequestStatusType = 'pending' | 'in_progress' | 'active';
export type HelpRequestData = Database['public']['Tables']['help_requests']['Row'];
export type HelpRequestUpdate = Database['public']['Tables']['help_requests']['Update'];
export type HelpRequestAssignmentData = Database['public']['Tables']['help_request_assignments']['Row'];
export type HelpRequestAssignmentInsert = Database['public']['Tables']['help_request_assignments']['Insert'];

export type HelpRequestAdditionalInfo = {
  special_situations?: string;
  email?: string;
};
