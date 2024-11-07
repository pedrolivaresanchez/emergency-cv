import './globals.css';
import 'leaflet/dist/leaflet.css';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { ModalProvider } from '@/context/ModalProvider';
import { createClient } from '@/lib/supabase/server';
import { SessionProvider } from '@/context/SessionProvider';
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
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <Toaster position="bottom-left" richColors />
        <SessionProvider session={session}>
          <QueryClientProvider>
            <ModalProvider>
              <SidebarLayout>{children}</SidebarLayout>
            </ModalProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
