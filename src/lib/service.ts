import { supabase } from './supabase/client';
import { HelpRequestAssignmentData, HelpRequestData } from '@/types/Requests';
import { createClient } from '@/lib/supabase/server';

export const helpRequestService = {
  async createRequest(requestData:HelpRequestData) {
    const { data, error } = await supabase.from('help_requests').insert([requestData]).select();

    if (error) throw error;
    return data[0];
  },
  async editRequest(requestData: any, id: any) {
    const { data, error } = await supabase.from('help_requests').update(requestData).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  async getAll() {
    const { data, error } = await supabase.from('help_requests').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async assign(requestData:HelpRequestAssignmentData) {
    const { data, error } = await supabase.from('help_request_assignments').insert([requestData]).select();

    if (error) throw error;
    return data[0];
  },

  async getByType(type:any) {
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const missingPersonService = {
  async create(data:any) {
    const { data: result, error } = await supabase.from('missing_persons').insert([data]).select();

    if (error) throw error;
    return result[0];
  },

  async getAll() {
    const { data, error } = await supabase
      .from('missing_persons')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const collectionPointService = {
  create: async (data:any) => {
    try {
      // Validate required fields
      if (!data.name) throw new Error('El nombre del centro es requerido');
      if (!data.location) throw new Error('La dirección es requerida');
      if (!data.city) throw new Error('La ciudad es requerida');
      if (!data.contact_name) throw new Error('El nombre del responsable es requerido');
      if (!data.contact_phone) throw new Error('El teléfono de contacto es requerido');

      const { data: result, error } = await supabase
        .from('collection_points')
        .insert([
          {
            ...data,
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      if (!result || result.length === 0) {
        throw new Error('No se pudo crear el punto de recogida');
      }

      return result[0];
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  },

  async getAll() {
    const { data, error } = await supabase
      .from('collection_points')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const mapService = {
  async getAllMapPoints() {
    try {
      // Get help requests
      const helpRequestsResponse = await supabase.from('help_requests').select('*').eq('status', 'active');

      if (helpRequestsResponse.error) {
        console.error('Help Requests Error:', helpRequestsResponse.error);
        throw new Error(helpRequestsResponse.error.message);
      }

      // Get missing persons
      const missingPersonsResponse = await supabase.from('missing_persons').select('*').eq('status', 'active');

      if (missingPersonsResponse.error) {
        console.error('Missing Persons Error:', missingPersonsResponse.error);
        throw new Error(missingPersonsResponse.error.message);
      }

      // Get collection points
      const collectionPointsResponse = await supabase.from('collection_points').select('*').eq('status', 'active');

      if (collectionPointsResponse.error) {
        console.error('Collection Points Error:', collectionPointsResponse.error);
        throw new Error(collectionPointsResponse.error.message);
      }

      // Log successful responses
      console.log('Help Requests:', helpRequestsResponse.data);
      console.log('Missing Persons:', missingPersonsResponse.data);
      console.log('Collection Points:', collectionPointsResponse.data);

      return {
        helpRequests: helpRequestsResponse.data || [],
        missingPersons: missingPersonsResponse.data || [],
        collectionPoints: collectionPointsResponse.data || [],
      };
    } catch (error:any) {
      console.error('MapService Error Details:', {
        message: error.message,
        error: error,
      });
      throw new Error(error.message || 'Error al obtener los datos del mapa');
    }
  },
};

export const townsService = {
  async getTowns() {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('towns').select('id, name');
    return data;
  }
}

// Add this function to test the connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('help_requests').select('count').single();

    if (error) {
      console.error('Supabase Connection Error:', error);
      throw error;
    }

    console.log('Supabase Connection Success:', data);
    return true;
  } catch (error) {
    console.error('Connection Test Failed:', error);
    return false;
  }
};

export const authService = {
  async getSessionUser() {
    return supabase.auth.getUser();
  },
  async signUp(email:any, password:any, nombre:any, telefono:any) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          telefono,
        },
      },
    });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  async signIn(email:any, password:any) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async updateUser(metadata:any) {
    return supabase.auth.updateUser({ ...metadata });
  },
};

const getSupabaseClient = async () => {
  if (typeof window === 'undefined') {
    // Si estamos en el servidor, usa el cliente del servidor
    return await createClient();
  } else {
    // Si estamos en el cliente, usa el cliente del navegador
    return supabase;
  }
};