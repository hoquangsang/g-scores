import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppSkeleton } from '@/components/app-skeleton';

import './globals.css';

export const metadata: Metadata = {
  title: 'G-Scores',
  description: 'National exam score lookup and reporting dashboard.',
};

type RootLayoutProps = {
  readonly children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppSkeleton>{children}</AppSkeleton>
      </body>
    </html>
  );
}
