import './globals.css';
import 'leaflet/dist/leaflet.css';
import EmergencyLayout from '@/components/layout/EmergencyLayout';

export const metadata = {
  title: 'Ajuda Dana - Sistema de Coordinación',
  description: 'Sistema de coordinación para emergencias en la Comunidad Valenciana',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <EmergencyLayout>
          {children}
        </EmergencyLayout>
      </body>
    </html>
  );
}