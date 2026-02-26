import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Visa Admin Panel — South Africa',
  description: 'Visa Application Tracking & Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            },
            success: { style: { background: '#15803d' } },
            error:   { style: { background: '#dc2626' } },
          }}
        />
      </body>
    </html>
  );
}
