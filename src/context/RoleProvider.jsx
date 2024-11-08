'use client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useSession } from './SessionProvider';

const RoleContext = createContext < RoleContextType > null;

export const RoleProvider = ({ children }) => {
  const session = useSession();
  const [role, setRole] = (useState < string) | (null > 'user');

  useEffect(() => {
    const fetchRole = async () => {
      if (session && session.user) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching role:', error.message);
            setRole(null);
          } else if (data) {
            setRole(data.role);
          } else {
            console.warn('No role found for this user.');
            setRole('user');
          }
        } catch (error) {
          console.error('Unexpected error fetching role:', error);
          setRole(null);
        }
      }
    };

    fetchRole();
  }, [session]);

  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
