import './globals.css';
import 'leaflet/dist/leaflet.css';
import EmergencyLayout from '@/components/layout/EmergencyLayout';
import { FC } from 'react';

export const metadata = {
  title: 'Ajuda Dana - Sistema de Coordinación',
  description: 'Sistema de coordinación para emergencias en la Comunidad Valenciana',
};

type RootLayoutProps = {
  children: React.ReactNode;
};
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <EmergencyLayout>{children}</EmergencyLayout>
      </body>
    </html>
  );
};

export default RootLayout;
