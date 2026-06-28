import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ERP Demo',
  description: 'ERP Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
