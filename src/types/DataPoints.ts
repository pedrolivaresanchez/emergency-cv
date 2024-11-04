interface DataPoint {
  type: string;
  name: string | null;
  contact_info: string;
  location: string | null;
}

export interface CollectionPointData extends DataPoint {
  contact_name: string;
  contact_phone: string;
  city: string;
}

export interface HelpOfferData extends DataPoint {
  help_type: string[] | null;
  description: string | null;
  resources: {
    vehicle: string;
    availability: string[];
    radius: number;
  };
  status: string;
  additional_info: {
    email: string;
    experience: string;
  };
  latitude: number | null;
  longitude: number | null;
  town_id: string;
}

export interface MissingPersonData extends DataPoint {
  help_type: string[] | null;
  description: string | null;
  resources: string;
  status: string;
}
