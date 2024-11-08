import './globals.css';
import 'leaflet/dist/leaflet.css';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { ModalProvider } from '@/context/ModalProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { Toaster } from 'sonner';
import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@/context/QueryClientProvider';

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
