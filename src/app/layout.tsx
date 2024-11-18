import './globals.css';
import 'leaflet/dist/leaflet.css';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { ModalProvider } from '@/context/ModalProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { Toaster } from 'sonner';
import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@/context/QueryClientProvider';
import { RoleProvider } from '@/context/RoleProvider';
import { TownProvider } from '../context/TownProvider';

export const metadata = {
  title: 'Ajuda Dana - Sistema de Coordinación',
  description: 'Sistema de coordinación para emergencias en la Comunidad Valenciana',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <Toaster position="bottom-left" richColors />
        <SessionProvider>
          <RoleProvider>
            <QueryClientProvider>
              <TownProvider>
                <ModalProvider>
                  <SidebarLayout>{children}</SidebarLayout>
                </ModalProvider>
              </TownProvider>
            </QueryClientProvider>
          </RoleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
