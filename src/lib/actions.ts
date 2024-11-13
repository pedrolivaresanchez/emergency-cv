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

export async function createRequest(requestData: HelpRequestInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .insert([requestData])
    .select(helpDataSelectFields as '*');

  if (error) throw error;
  return data[0] as SelectedHelpData;
}

export async function editRequest(requestData: HelpRequestUpdate, id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .update(requestData)
    .eq('id', id)
    .select(helpDataSelectFields as '*');
  if (error) throw error;
  return data[0] as SelectedHelpData;
}

export async function updateHelpRequestUrgency(helpRequestId: string, status: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .update({ urgency: status })
    .eq('id', helpRequestId)
    .select();

  return { data, error };
}

export async function updateHelpRequestStatus(helpRequestId: string, status: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .update({ status: status })
    .eq('id', helpRequestId)
    .select();

  return { data, error };
}

export async function updateHelpRequestCRMStatus(helpRequestId: string, status: string, crmStatus: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .update({ status, crm_status: crmStatus })
    .eq('id', helpRequestId)
    .select();

  return { data, error };
}

export async function updateNotesRequest(newNotes: string, helpRequestId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .update({ notes: newNotes })
    .eq('id', helpRequestId)
    .select();

  return { data, error };
}

export async function deleteHelpRequest(helpRequestId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('help_requests').delete().eq('id', helpRequestId).select();
  return { data, error };
}

export async function getOne(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('help_requests')
    .select(helpDataSelectFields as '*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as SelectedHelpData;
}

export async function getOneWithCoords(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('help_requests').select('*').eq('id', id).single();
  if (error) throw error;
  return data as HelpRequestData;
}

export async function addComment(id: number, comment: string, is_solved: boolean) {
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
}

export async function removeComment(id: number) {
  const supabase = await createClient();
  const { error: errorDeletingAssignment } = await supabase.from('comments').delete().eq('id', id);
  if (errorDeletingAssignment) throw errorDeletingAssignment;
}

export async function getComments(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('comments').select('*').eq('help_request_id', id);

  if (error) throw error;
  return data;
}

export async function getRequestsByUser(user_id: string | undefined) {
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
}

export async function getOffersByUser(user_id: string | undefined) {
  const supabase = await createClient();
  if (user_id === undefined) return [];
  const { data: requests, error: requestsError } = await supabase
    .from('help_requests')
    .select(helpDataSelectFields as '*')
    .eq('type', 'ofrece')
    .eq('user_id', user_id);
  if (requestsError) throw requestsError;
  return requests as SelectedHelpData[];
}

export async function getSolicitudesByUser(user_id: string | undefined) {
  const supabase = await createClient();
  if (user_id === undefined) return [];
  const { data: requests, error: requestsError } = await supabase
    .from('help_requests')
    .select(helpDataSelectFields as '*')
    .eq('type', 'necesita')
    .eq('user_id', user_id);
  if (requestsError) throw requestsError;
  return requests as SelectedHelpData[];
}

export async function getAssignments(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('help_request_assignments').select('*').eq('help_request_id', id);

  if (error) throw error;
  return data;
}

export async function assign(requestData: HelpRequestAssignmentInsert) {
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
}

export async function unassign(id: number) {
  const supabase = await createClient();
  const { error: errorDeletingAssignment } = await supabase.from('help_request_assignments').delete().eq('id', id);
  if (errorDeletingAssignment) throw errorDeletingAssignment;
}

export async function getTodaysCountByTown() {
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
}

// TOWN ACTIONS
export async function getTownByName(townName: string) {
  const supabase = await createClient();
  return await supabase.from('towns').select('id').eq('name', townName);
}

export async function createTown(townName: string) {
  const supabase = await createClient();
  return await supabase.from('towns').insert({ name: townName }).select('id');
}

export async function getTowns() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('towns').select();
  if (error) throw error;
  return data;
}

export async function createIfNotExists(townName: string) {
  const response = await getTownByName(townName);
  if (response.error) return response;

  // new town should be created
  if (response.data.length === 0) {
    return await createTown(townName);
  }

  return response;
}

// PUNTOS ENTREGA
export async function getPuntosDeEntrega() {
  const supabase = await createClient();
  return await supabase.from('delivery_points').select('*').order('created_at', { ascending: false });
}

export async function createPuntoDeEntrega(puntosDeEntrega: PuntoDeEntrega[]) {
  const supabase = await createClient();
  return await supabase.from('delivery_points').insert(puntosDeEntrega);
}

// PUNTOS DE RECOGIDA

export async function getPuntosDeRecogida() {
  const supabase = await createClient();
  return await supabase.from('collection_points').select('*').order('created_at', { ascending: false });
}

export async function insertPuntoDeRecogida(puntosDeRecgida: PuntoDeRecogida[]) {
  const supabase = await createClient();
  return await supabase.from('collection_points').insert(puntosDeRecgida);
}

// ROLES
export async function getRolesByUser(userId: string) {
  const supabase = await createClient();
  return await supabase.from('user_roles').select('role').eq('user_id', userId).limit(1).single();
}

// AUTH

export async function getSessionUser() {
  const supabase = await createClient();
  return supabase.auth.getUser();
}

export async function getSession() {
  const supabase = await createClient();
  return supabase.auth.getSession();
}

export async function signUp(email: any, password: any, nombre: any, telefono: any, privacyPolicy: boolean) {
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
}

export async function signOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function refreshToken(refresh_token: string) {
  const supabase = await createClient();
  return supabase.auth.refreshSession({ refresh_token });
}

export async function signInWithOAuth(credentials: SignInWithOAuthCredentials) {
  const supabase = await createClient();
  return supabase.auth.signInWithOAuth(credentials);
}

export async function updateUser(metadata: any) {
  const supabase = await createClient();
  return supabase.auth.updateUser({ ...metadata });
}

export async function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): Promise<{
  data: {
    subscription: Subscription;
  };
}> {
  const supabase = await createClient();
  return supabase.auth.onAuthStateChange(callback);
}
