import './globals.css';
import 'leaflet/dist/leaflet.css';
import EmergencyLayout from '@/components/layout/EmergencyLayout';
import { ModalProvider } from '@/context/ModalProvider';
import { TownsProvider } from '@/context/TownProvider';
import { createClient } from '@/lib/supabase/server';
import { SessionProvider } from '@/context/SessionProvider';
import { townsService } from '@/lib/service';
import { Toaster } from 'sonner';
import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@/context/QueryClientProvider';

export const metadata = {
  title: 'Ajuda Dana - Sistema de Coordinación',
  description: 'Sistema de coordinación para emergencias en la Comunidad Valenciana',
};

const getSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return data;
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  const towns = await townsService.getTowns();
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <Toaster position="bottom-left" richColors />
        <SessionProvider session={session}>
          <QueryClientProvider>
            <TownsProvider towns={towns}>
              <ModalProvider>
                <EmergencyLayout>{children}</EmergencyLayout>
              </ModalProvider>
            </TownsProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
