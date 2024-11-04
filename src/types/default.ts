export type UrgencyType = 'alta' | 'media' | 'baja';
export type StatusType = 'pending' | 'in_progress' | 'active';

export type CaseProps = {
  id: string;
  name: string;
  urgency: UrgencyType;
  status: StatusType;
  description: string;
  town_id?: string;
  location: string;
  created_at: string;
  contact_info?: string;
  help_type?: string[];
  additional_info?: {
    special_situations?: string;
  };
  number_of_people?: number;
};
