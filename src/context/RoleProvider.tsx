'use client';

import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useSession } from './SessionProvider';
import { roleService } from '../lib/actions';

const RoleContext = createContext<string>('user');

export const RoleProvider = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const [role, setRole] = useState<string | null>('user');

  useEffect(() => {
    const fetchRole = async () => {
      if (session && session.user) {
        try {
          const { data, error } = await roleService.getRolesByUser(session.user.id);

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

  return <RoleContext.Provider value={role ?? 'anon'}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
