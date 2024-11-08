import { Database } from './database';

export type HelpRequestType = 'necesita' | 'ofrece';
export type HelpRequestUrgencyType = 'alta' | 'media' | 'baja';
export type HelpRequestStatusType = 'pending' | 'in_progress' | 'active';
type HelpRequestJsonFields = {
  additional_info: HelpRequestAdditionalInfo;
  resources: HelpRequestResources | null;
};
export type HelpRequestData = Database['public']['Tables']['help_requests']['Row'] & HelpRequestJsonFields;
export type HelpRequestInsert = Database['public']['Tables']['help_requests']['Insert'] & HelpRequestJsonFields;
export type HelpRequestUpdate = Database['public']['Tables']['help_requests']['Update'] & HelpRequestJsonFields;
export type HelpRequestAssignmentData = Database['public']['Tables']['help_request_assignments']['Row'];
export type HelpRequestAssignmentInsert = Database['public']['Tables']['help_request_assignments']['Insert'];

export type HelpRequestAdditionalInfo = {
  special_situations?: string;
  email?: string;
  experience?: string;
};

export type HelpRequestResources = {
  radius?: number;
  vehicle?: string;
  availability?: string[];
};
