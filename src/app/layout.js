import './globals.css';
import 'leaflet/dist/leaflet.css';
import EmergencyLayout from '@/components/layout/EmergencyLayout';
import { EmergencyProvider } from '@/context/EmergencyProvider';
import { TownsProvider } from '@/context/TownProvider';
import { createClient } from '@/lib/supabase/server';
import { SessionProvider } from '@/context/SessionProvider';
import { townsService } from '@/lib/service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Ajuda Dana - Sistema de Coordinación',
  description: 'Sistema de coordinación para emergencias en la Comunidad Valenciana',
};

const queryClient = new QueryClient();

const getSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return data;
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const towns = await townsService.getTowns();
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <Toaster />
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
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
