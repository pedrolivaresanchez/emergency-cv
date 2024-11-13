import { Database } from './database';

export type HelpRequestType = 'necesita' | 'ofrece';
export type HelpRequestUrgencyType = 'alta' | 'media' | 'baja';
export type HelpRequestStatusType = 'pending' | 'in_progress' | 'active';
type HelpRequestJsonFields = {
  additional_info: HelpRequestAdditionalInfo;
  resources: HelpRequestResources | null;
};
export type HelpRequestHelpType = Database['public']['Enums']['help_type_enum'];
export type HelpRequestDbRow = Database['public']['Tables']['help_requests']['Row'];
export type HelpRequestData = Omit<HelpRequestDbRow, 'additional_info' | 'resources'> & HelpRequestJsonFields;
export type HelpRequestInsert = Database['public']['Tables']['help_requests']['Insert'] & HelpRequestJsonFields;
export type HelpRequestUpdate = Database['public']['Tables']['help_requests']['Update'] & HelpRequestJsonFields;
export type HelpRequestAssignmentData = Database['public']['Tables']['help_request_assignments']['Row'];
export type HelpRequestAssignmentInsert = Database['public']['Tables']['help_request_assignments']['Insert'];

export type HelpRequestComment = Database['public']['Tables']['comments']['Row'];

export type HelpRequestAdditionalInfo = {
  special_situations?: string;
  email?: string;
  experience?: string;
  consent?: boolean;
};

export type HelpRequestResources = {
  radius?: number;
  vehicle?: string;
  availability?: string[];
};

export type PuntoDeEntrega = {
  name: string;
  location: string;
  city: string;
  contact_name: string | null;
  contact_phone: string | null | undefined;
  contact_email: string | null;
  vehicle_type: string | null;
  cargo_type: string | null;
  schedule: string | null;
  additional_info: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
};

export type OmitSelect<T, K extends string> = { [key in keyof Omit<T, K>]: T[key] };
export type SelectStringBuilder<T, K extends string> = { [key in keyof Omit<T, K>]: true };

export type OmitHelpDataFields = 'location' | 'coordinates' | 'latitude' | 'longitude' | 'contact_info';
export type SelectHelpDataStringBuilder = SelectStringBuilder<HelpRequestData, OmitHelpDataFields>;
export type SelectedHelpData = OmitSelect<HelpRequestData, OmitHelpDataFields>;
export const helpDataSelectFieldsObject: SelectHelpDataStringBuilder = {
  additional_info: true,
  asignees_count: true,
  created_at: true,
  crm_status: true,
  description: true,
  help_type: true,
  id: true,
  name: true,
  notes: true,
  number_of_people: true,
  other_help: true,
  people_needed: true,
  resources: true,
  status: true,
  town_id: true,
  type: true,
  urgency: true,
  user_id: true,
};
export const helpDataSelectFields = Object.keys(helpDataSelectFieldsObject).join(',');
