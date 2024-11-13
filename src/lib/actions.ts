'use server';

import {
  helpDataSelectFields,
  HelpRequestAssignmentInsert,
  HelpRequestData,
  HelpRequestInsert,
  HelpRequestUpdate,
  PuntoDeEntrega,
  PuntoDeRecogida,
  SelectedHelpData,
} from '@/types/Requests';
import { createClient } from './supabase/server';
import { AuthChangeEvent, Session, SignInWithOAuthCredentials, Subscription } from '@supabase/supabase-js';

export const helpRequestService = {
  async createRequest(requestData: HelpRequestInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .insert([requestData])
      .select(helpDataSelectFields as '*');

    if (error) throw error;
    return data[0] as SelectedHelpData;
  },
  async editRequest(requestData: HelpRequestUpdate, id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .update(requestData)
      .eq('id', id)
      .select(helpDataSelectFields as '*');
    if (error) throw error;
    return data[0] as SelectedHelpData;
  },
  async updateHelpRequestUrgency(helpRequestId: string, status: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .update({ urgency: status })
      .eq('id', helpRequestId)
      .select();

    return { data, error };
  },
  async updateHelpRequestStatus(helpRequestId: string, status: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .update({ status: status })
      .eq('id', helpRequestId)
      .select();

    return { data, error };
  },
  async updateHelpRequestCRMStatus(helpRequestId: string, status: string, crmStatus: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .update({ status, crm_status: crmStatus })
      .eq('id', helpRequestId)
      .select();

    return { data, error };
  },
  async updateNotesRequest(newNotes: string, helpRequestId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .update({ notes: newNotes })
      .eq('id', helpRequestId)
      .select();

    return { data, error };
  },
  async deleteHelpRequest(helpRequestId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('help_requests').delete().eq('id', helpRequestId).select();
    return { data, error };
  },
  async getOne(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('help_requests')
      .select(helpDataSelectFields as '*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as SelectedHelpData;
  },
  async getOneWithCoords(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('help_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data as HelpRequestData;
  },
  async addComment(id: number, comment: string, is_solved: boolean) {
    const supabase = await createClient();
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
    const supabase = await createClient();
    const { error: errorDeletingAssignment } = await supabase.from('comments').delete().eq('id', id);
    if (errorDeletingAssignment) throw errorDeletingAssignment;
  },
  async getComments(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('comments').select('*').eq('help_request_id', id);

    if (error) throw error;
    return data;
  },

  async getRequestsByUser(user_id: string | undefined) {
    const supabase = await createClient();
    if (user_id === undefined) return [];
    const { data: assignments, error: assignmentsError } = await supabase
      .from('help_request_assignments')
      .select('help_request_id')
      .eq('user_id', user_id);
    if (assignmentsError) throw assignmentsError;
    const helpRequestIds = assignments.map((assignment) => assignment.help_request_id);
    const { data: requests, error: requestsError } = await supabase
      .from('help_requests')
      .select(helpDataSelectFields as '*')
      .eq('type', 'necesita')
      .or(`user_id.eq.${user_id},id.in.(${helpRequestIds.join(',')})`);
    if (requestsError) throw requestsError;
    return requests as SelectedHelpData[];
  },

  async getOffersByUser(user_id: string | undefined) {
    const supabase = await createClient();
    if (user_id === undefined) return [];
    const { data: requests, error: requestsError } = await supabase
      .from('help_requests')
      .select(helpDataSelectFields as '*')
      .eq('type', 'ofrece')
      .eq('user_id', user_id);
    if (requestsError) throw requestsError;
    return requests as SelectedHelpData[];
  },
  async getSolicitudesByUser(user_id: string | undefined) {
    const supabase = await createClient();
    if (user_id === undefined) return [];
    const { data: requests, error: requestsError } = await supabase
      .from('help_requests')
      .select(helpDataSelectFields as '*')
      .eq('type', 'necesita')
      .eq('user_id', user_id);
    if (requestsError) throw requestsError;
    return requests as SelectedHelpData[];
  },
  async getAssignments(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('help_request_assignments').select('*').eq('help_request_id', id);

    if (error) throw error;
    return data;
  },

  async assign(requestData: HelpRequestAssignmentInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('help_request_assignments').insert([requestData]).select();
    if (error) throw error;

    const { data: linkedRequestData, error: errorGettingLinkedData } = await supabase
      .from('help_requests')
      .select(helpDataSelectFields as '*')
      .eq('id', requestData.help_request_id);
    if (errorGettingLinkedData) throw errorGettingLinkedData;
    if (!linkedRequestData) throw new Error('No se puede encontrar esta tarea');

    return data[0];
  },
  async unassign(id: number) {
    const supabase = await createClient();
    const { error: errorDeletingAssignment } = await supabase.from('help_request_assignments').delete().eq('id', id);
    if (errorDeletingAssignment) throw errorDeletingAssignment;
  },

  async getTodaysCountByTown() {
    const supabase = await createClient();
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

export const townService = {
  async getByName(townName: string) {
    const supabase = await createClient();
    return await supabase.from('towns').select('id').eq('name', townName);
  },
  async create(townName: string) {
    const supabase = await createClient();
    return await supabase.from('towns').insert({ name: townName }).select('id');
  },
  async getTowns() {
    const supabase = await createClient();
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

export const puntosDeEntregaService = {
  async getPuntosDeEntrega() {
    const supabase = await createClient();
    return await supabase.from('delivery_points').select('*').order('created_at', { ascending: false });
  },
  async createPuntoDeEntrega(puntosDeEntrega: PuntoDeEntrega[]) {
    const supabase = await createClient();
    return await supabase.from('delivery_points').insert(puntosDeEntrega);
  },
};

export const puntosDeRecogidaService = {
  async getPuntosDeRecogida() {
    const supabase = await createClient();
    return await supabase.from('collection_points').select('*').order('created_at', { ascending: false });
  },

  async insertPuntoDeRecogida(puntosDeRecgida: PuntoDeRecogida[]) {
    const supabase = await createClient();
    return await supabase.from('collection_points').insert(puntosDeRecgida);
  },
};

export const roleService = {
  async getRolesByUser(userId: string) {
    const supabase = await createClient();
    return await supabase.from('user_roles').select('role').eq('user_id', userId).limit(1).single();
  },
};

export const authService = {
  async getSessionUser() {
    const supabase = await createClient();
    return supabase.auth.getUser();
  },
  async signUp(email: any, password: any, nombre: any, telefono: any, privacyPolicy: boolean) {
    const supabase = await createClient();
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
    const supabase = await createClient();
    return supabase.auth.signOut();
  },
  async signIn(email: string, password: string) {
    const supabase = await createClient();
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signInWithOAuth(credentials: SignInWithOAuthCredentials) {
    const supabase = await createClient();
    return supabase.auth.signInWithOAuth(credentials);
  },
  async updateUser(metadata: any) {
    const supabase = await createClient();
    return supabase.auth.updateUser({ ...metadata });
  },
  async onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): Promise<{
    data: {
      subscription: Subscription;
    };
  }> {
    const supabase = await createClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};
