import { SupabaseTown } from '@/types/common';

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
  tiposDeAyuda: HelpCategory[];
};

export type HelpCategory = {
  id: number;
  label: string;
};

export type TipoDeAyudaInputRendererProps = Omit<HelpCategory, 'id'> & {
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
