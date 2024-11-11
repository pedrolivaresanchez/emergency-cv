import { supabase } from './supabase/client';
import { Database } from '@/types/database';
import { HelpRequestAssignmentInsert, HelpRequestUpdate } from '@/types/Requests';
import { createClient } from '@/lib/supabase/server';
import { HRV, HRVUpdate } from '@/types/HelpRequestsVolunteers';

export const helpRequestService = {
  async createRequest(requestData: Database['public']['Tables']['help_requests']['Insert']) {
    const { data, error } = await supabase.from('help_requests').insert([requestData]).select();

    if (data) {
      await helpRequestsVolunteers.insertRequest({ id: data[0].id });
    }

    if (error) throw error;
    return data[0];
  },
  async editRequest(requestData: HelpRequestUpdate, id: number) {
    const { data, error } = await supabase.from('help_requests').update(requestData).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  async getAll() {
    const { data, error } = await supabase.from('help_requests').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  async getOne(id: number) {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('help_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async getRequestsByUser(user_id: string | undefined) {
    if (user_id === undefined) return [];
    const { data: assignments, error: assignmentsError } = await supabase
      .from('help_request_assignments')
      .select('help_request_id')
      .eq('user_id', user_id);
    if (assignmentsError) throw assignmentsError;
    const helpRequestIds = assignments.map((assignment) => assignment.help_request_id);
    const { data: requests, error: requestsError } = await supabase
      .from('help_requests')
      .select('*')
      .eq('type', 'necesita')
      .or(`user_id.eq.${user_id},id.in.(${helpRequestIds.join(',')})`);
    if (requestsError) throw requestsError;
    return requests;
  },

  async getOffersByUser(user_id: string | undefined) {
    if (user_id === undefined) return [];
    const { data: requests, error: requestsError } = await supabase
      .from('help_requests')
      .select('*')
      .eq('type', 'ofrece')
      .eq('user_id', user_id);
    if (requestsError) throw requestsError;
    return requests;
  },

  async getAssignments(id: number) {
    const { data, error } = await supabase.from('help_request_assignments').select('*').eq('help_request_id', id);

    if (error) throw error;
    return data;
  },

  async assign(requestData: HelpRequestAssignmentInsert) {
    const { data, error } = await supabase.from('help_request_assignments').insert([requestData]).select();
    if (error) throw error;

    await helpRequestsVolunteers.incrementAssigneesCount({ id: requestData.help_request_id });

    return data[0];
  },
  async unassign(id: number) {
    const { data, error: errorFindingRow } = await supabase.from('help_request_assignments').select('*').eq('id', id);
    if (errorFindingRow || !data) {
      throw new Error('No se puede encontrar la tarea');
    }

    const requestId = data[0].help_request_id;

    const { error: errorDeletingAssignment } = await supabase.from('help_request_assignments').delete().eq('id', id);
    if (errorDeletingAssignment) throw errorDeletingAssignment;

    await helpRequestsVolunteers.decreaseAssigneesCount({ id: requestId });
  },

  async getByType(type: any) {
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  async getTodaysCount() {
    const today = new Date().toISOString().split('T')[0];
    const supabase = await getSupabaseClient();
    const { count: solicitaCount, error: solicitaError } = await supabase
      .from('help_requests')
      .select('id', { count: 'exact' })
      .eq('type', 'necesita')
      .gte('created_at', today)
      .lte('created_at', `${today}T23:59:59.999Z`);

    const { count: ofreceCount, error: ofreceError } = await supabase
      .from('help_requests')
      .select('id', { count: 'exact' })
      .eq('type', 'ofrece')
      .gte('created_at', today)
      .lte('created_at', `${today}T23:59:59.999Z`);

    if (solicitaError) {
      throw new Error('Error fetching solicita:', solicitaError);
    }
    if (ofreceError) {
      throw new Error('Error fetching ofrece:', ofreceError);
    }
    return {
      solicitudes: solicitaCount || 0,
      ofertas: ofreceCount || 0,
    };
  },
  async getTodaysCountByTown() {
    const supabase = await getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];

    const { data: towns, error: townError } = await supabase.from('towns').select('id, name');

    if (townError) {
      console.log('Error fetching towns:', townError);
      throw townError;
    }

    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .in('type', ['ofrece', 'necesita'])
      .gte('created_at', today)
      .lte('created_at', `${today}T23:59:59.999Z`);

    if (error) {
      console.log('Error fetching help requests:', error);
      throw error;
    }

    const volunteersCount = new Map();
    const needHelpCount = new Map();

    data.forEach((person) => {
      const townId = person.town_id;
      if (person.type === 'ofrece') {
        volunteersCount.set(townId, (volunteersCount.get(townId) || 0) + 1);
      } else if (person.type === 'necesita') {
        needHelpCount.set(townId, (needHelpCount.get(townId) || 0) + 1);
      }
    });

    return towns.map((town) => ({
      id: town.id,
      name: town.name ?? 'N/A',
      count: volunteersCount.get(town.id) || 0,
      needHelp: needHelpCount.get(town.id) || 0,
    }));
  },
};

export const townService = {
  async getByName(townName: string) {
    return await supabase.from('towns').select('id').eq('name', townName);
  },
  async create(townName: string) {
    return await supabase.from('towns').insert({ name: townName }).select('id');
  },
  async getTowns() {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('towns').select();
    if (error) throw error;
    return data;
  },
  async createIfNotExists(townName: string) {
    const response = await this.getByName(townName);
    if (response.error) return response;

    // new town should be created
    if (response.data.length === 0) {
      return await townService.create(townName);
    }

    return response;
  },
};

export const missingPersonService = {
  async create(data: any) {
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
  create: async (data: any) => {
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
    } catch (error: any) {
      console.error('MapService Error Details:', {
        message: error.message,
        error: error,
      });
      throw new Error(error.message || 'Error al obtener los datos del mapa');
    }
  },
};

export const helpRequestsVolunteers = {
  async insertRequest(data: Pick<HRV, 'id'>) {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('help_requests_volunteers').insert(data);
    if (error) {
      console.log('Error inserting helpRequestsVolunteers row: ', error);
      throw new Error('Error inserting helpRequestsVolunteers row');
    }
  },
  async getRequest(readData: Pick<HRV, 'id'>) {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('help_requests_volunteers').select().eq('id', readData.id);
    if (error) {
      console.log('Error getting the request from helpRequestsVolunteers: ', error);
      throw new Error('Error getting the request from helpRequestsVolunteers');
    }

    if (!data) {
      throw new Error('No data found in helpRequestsVolunteers');
    }

    return data[0];
  },
  async getAllRequests() {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('help_requests_volunteers').select();
    if (error) {
      console.log('Error getting the all the requests from helpRequestsVolunteers: ', error);
      throw new Error('Error getting all the the requests from helpRequestsVolunteers');
    }

    if (!data) {
      throw new Error('No data found in helpRequestsVolunteers for all requests');
    }

    return data;
  },
  async updateRequest({ assignees_count, id }: HRVUpdate) {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('help_requests_volunteers').update({ assignees_count }).eq('id', id);
    if (error) {
      console.log('Error updating the request in helpRequestsVolunteers: ', error);
      throw new Error('Error updating the request in helpRequestsVolunteers');
    }
  },
  async incrementAssigneesCount(data: Pick<HRV, 'id'>) {
    const { assignees_count: prev_assignees_count } = await helpRequestsVolunteers.getRequest(data);
    return this.updateRequest({ ...data, assignees_count: prev_assignees_count + 1 });
  },
  async decreaseAssigneesCount(data: Pick<HRV, 'id'>) {
    const { assignees_count: prev_assignees_count } = await helpRequestsVolunteers.getRequest(data);
    return this.updateRequest({ ...data, assignees_count: prev_assignees_count - 1 });
  },
};

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
  async signUp(email: any, password: any, nombre: any, telefono: any, privacyPolicy: boolean) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          telefono,
          privacyPolicy,
        },
      },
    });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async updateUser(metadata: any) {
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
