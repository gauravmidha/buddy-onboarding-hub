import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/hooks/useAuth';
import { DataRefreshProvider } from '@/hooks/useDataRefresh';
import { ThemeProvider } from '@/hooks/useTheme';

import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buddy Onboarding Hub - Powered by Zenafide',
  description: 'Streamline your employee onboarding process with AI-powered assistance',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} scrollbar-light dark:scrollbar-dark`}>
        <ThemeProvider>
          <AuthProvider>
            <DataRefreshProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Navbar />
                <main>{children}</main>
                <Toaster />
              </div>
            </DataRefreshProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}