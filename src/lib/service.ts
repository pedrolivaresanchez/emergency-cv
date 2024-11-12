import { supabase } from './supabase/client';
import { HelpRequestAssignmentInsert, HelpRequestData, HelpRequestInsert, HelpRequestUpdate } from '@/types/Requests';
import { createClient } from '@/lib/supabase/server';

export const helpRequestService = {
  async createRequest(requestData: HelpRequestInsert) {
    const { data, error } = await supabase.from('help_requests').insert([requestData]).select();

    if (error) throw error;
    return data[0] as HelpRequestData;
  },
  async editRequest(requestData: HelpRequestUpdate, id: number) {
    const { data, error } = await supabase.from('help_requests').update(requestData).eq('id', id).select();
    if (error) throw error;
    return data[0] as HelpRequestData;
  },
  async getOne(id: number) {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('help_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data as HelpRequestData;
  },
  async addComment(id: number, comment: string, is_solved: boolean) {
    const supabase = await getSupabaseClient();

    const userResponse = await supabase.auth.getUser();
    const user = userResponse.data.user;
    if (!user) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          help_request_id: id,
          comment: comment,
          is_solved: is_solved,
          user_id: user.id,
          user_name: user.user_metadata.full_name ?? user.user_metadata.nombre ?? '',
          user_phone: user.user_metadata.telefono ?? '',
        },
      ])
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  async removeComment(id: number) {
    const { error: errorDeletingAssignment } = await supabase.from('comments').delete().eq('id', id);
    if (errorDeletingAssignment) throw errorDeletingAssignment;
  },
  async getComments(id: number) {
    const { data, error } = await supabase.from('comments').select('*').eq('help_request_id', id);

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
    return requests as HelpRequestData[];
  },

  async getOffersByUser(user_id: string | undefined) {
    if (user_id === undefined) return [];
    const { data: requests, error: requestsError } = await supabase
      .from('help_requests')
      .select('*')
      .eq('type', 'ofrece')
      .eq('user_id', user_id);
    if (requestsError) throw requestsError;
    return requests as HelpRequestData[];
  },

  async getAssignments(id: number) {
    const { data, error } = await supabase.from('help_request_assignments').select('*').eq('help_request_id', id);

    if (error) throw error;
    return data;
  },

  async assign(requestData: HelpRequestAssignmentInsert) {
    const { data, error } = await supabase.from('help_request_assignments').insert([requestData]).select();
    if (error) throw error;

    const { data: linkedRequestData, error: errorGettingLinkedData } = await supabase
      .from('help_requests')
      .select('*')
      .eq('id', requestData.help_request_id);
    if (errorGettingLinkedData) throw errorGettingLinkedData;
    if (!linkedRequestData) throw new Error('No se puede encontrar esta tarea');

    return data[0];
  },
  async unassign(id: number) {
    const { error: errorDeletingAssignment } = await supabase.from('help_request_assignments').delete().eq('id', id);
    if (errorDeletingAssignment) throw errorDeletingAssignment;
  },

  async getTodaysCountByTown() {
    const supabase = await getSupabaseClient();

    const { data: towns, error: townError } = await supabase
      .from('town_help_request_summary')
      .select('*')
      .or('offers_last_24h.gt.0,needs_last_24h.gt.0,unassigned_needs.gt.0');

    if (townError) {
      console.log('Error fetching towns:', townError);
      throw townError;
    }

    return towns;
  },
};

export const locationService = {
  async getFormattedAddress(longitude: string, latitude: string) {
    return await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        longitude,
        latitude,
      }),
    }).then((res) => res.json());
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
