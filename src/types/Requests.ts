export type HelpRequestType = 'necesita' | 'ofrece';
export type HelpRequestUrgencyType = 'alta' | 'media' | 'baja';
export type HelpRequestStatusType = 'pending' | 'in_progress' | 'active';
export type HelpRequestData = {
  id: number;
  created_at: string;
  type: HelpRequestType;
  name: string;
  location: string;
  description: string;
  urgency: HelpRequestUrgencyType;
  number_of_people: number;
  contact_info: string;
  additional_info: {
    consent: boolean;
    special_situations: string | null;
  };
  status: HelpRequestStatusType;
  resources: string | null;
  latitude: number | null;
  longitude: number | null;
  coordinates: { lat: number; lng: number } | null;
  help_type: string[];
  people_needed: number;
  town_id: number;
};

export type CollectionPointType = 'permanente' | 'temporal';
export type CollectionPointStatus = 'active' | 'inactive';
export type CollectionPointData = {
  id: number;
  created_at: string;
  name: string;
  type: CollectionPointType;
  location: string;
  city: string;
  contact_name: string;
  contact_phone: string;
  accepted_items: string[];
  urgent_needs: string;
  status: CollectionPointStatus;
  coordinates: { lat: number; lng: number } | null;
  schedule?: string;
  additional_info?: string | Record<string, any>;
};
