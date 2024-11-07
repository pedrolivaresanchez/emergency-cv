import './globals.css';
import 'leaflet/dist/leaflet.css';
import EmergencyLayout from '@/components/layout/EmergencyLayout';
import { EmergencyProvider } from '@/context/EmergencyProvider';
import { TownsProvider } from '@/context/TownProvider';
import { createClient } from '@/lib/supabase/server';
import { SessionProvider } from '@/context/SessionProvider';
import { townsService } from '@/lib/service';
import { Toaster } from 'sonner';
import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@/context/QueryClientProvider';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const metadata = {
  title: 'Ajuda Dana - Sistema de Coordinación',
  description: 'Sistema de coordinación para emergencias en la Comunidad Valenciana',
};

const getSession = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase.auth.getUser();
  return data;
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const session = await getSession(supabase);
  const towns = await townsService.getTowns(supabase);
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <Toaster position="bottom-left" richColors />
        <SessionProvider session={session}>
          <QueryClientProvider>
            <TownsProvider towns={towns}>
              <EmergencyProvider>
                <EmergencyLayout>{children}</EmergencyLayout>
              </EmergencyProvider>
            </TownsProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
