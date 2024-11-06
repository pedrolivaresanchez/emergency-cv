import { Database } from './database';

export type HelpRequestType = 'necesita' | 'ofrece';
export type HelpRequestUrgencyType = 'alta' | 'media' | 'baja';
export type HelpRequestStatusType = 'pending' | 'in_progress' | 'active';
export type HelpRequestData = Database['public']['Tables']['help_requests']['Row'];
export type HelpRequestAssignmentData = Database['public']['Tables']['help_request_assignments']['Row'];

export type HelpRequestAdditionalInfo = {
  special_situations?: string;
  email?: string;
}

export type CollectionPointType = 'permanente' | 'temporal';
export type CollectionPointStatus = 'active' | 'inactive';
export type CollectionPointData = Database['public']['Tables']['collection_points']['Row'];
