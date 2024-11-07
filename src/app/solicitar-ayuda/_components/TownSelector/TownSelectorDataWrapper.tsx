'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

import { TownSelectorRenderer } from './TownSelectorRenderer';
import { Town } from '../types';

type TownSelectorRendererProps = Pick<
  React.ComponentProps<typeof TownSelectorRenderer>,
  'handleChange' | 'selectedTown'
>;

export default function TownSelectorDataWrapper({ handleChange, selectedTown }: TownSelectorRendererProps) {
  const [towns, setTowns] = useState<Town[]>([]);

  useEffect(() => {
    async function fetchTowns() {
      const { data, error } = await supabase.from('towns').select('id, name');

      if (error) {
        console.log('Error fetching towns:', error);
        return;
      }

      setTowns(data);
    }

    fetchTowns();
  }, []);

  return <TownSelectorRenderer handleChange={handleChange} listOfTowns={towns} selectedTown={selectedTown} />;
}
