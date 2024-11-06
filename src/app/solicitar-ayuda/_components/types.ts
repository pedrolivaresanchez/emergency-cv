import { Town as SupabaseTown } from '@/types/Town';
import { Enums } from '@/types/common';

export type FormData = {
  nombre: string;
  contacto: string;
  email: string;
  numeroDePersonas: number | undefined;
  descripcion: string;
  urgencia: string;
  situacionEspecial: string;
  pueblo: string;
  consentimiento: boolean;
  ubicacion: string;
  coordinates: any;
  tiposDeAyuda: Map<HelpCategory['id'], boolean>;
};

export type HelpCategory = {
  id: number;
  label: string;
  enumLabel: Enums['help_type_enum'];
};

export type TipoDeAyudaInputRendererProps = Pick<HelpCategory, 'id' | 'label'> & {
  isSelected: boolean;
  handleTipoAyudaChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type Address = {
  road: string;
  house_number: string;
  postcode: string;
  city: string;
  state: string;
};

export type Status = {
  error: string | null;
  isSubmitting: boolean;
  success: boolean;
};

export type Town = Pick<SupabaseTown, 'id' | 'name'>;

export type HelpTypesMap = Map<HelpCategory['id'], { label: HelpCategory['label']; enum: Enums['help_type_enum'] }>;
