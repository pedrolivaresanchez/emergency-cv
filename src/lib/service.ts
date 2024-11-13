'use client';

import { supabase } from './supabase/client';

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
