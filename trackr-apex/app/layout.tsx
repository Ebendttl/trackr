import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrackR APEX — GIS Workout Analytics Platform',
  description:
    'A world-class, privacy-first workout tracker with GPS route drawing, live weather intelligence, and advanced performance analytics. No accounts, no tracking — just elite performance data.',
  keywords: ['workout tracker', 'GPS', 'running', 'cycling', 'open source', 'analytics'],
  authors: [
    { name: 'Fakolujo Micheal Ayomide' },
    { name: 'Akinseinde Ebenezer Akindele' },
  ],
  openGraph: {
    title: 'TrackR APEX',
    description: 'Elite GIS Workout Analytics Platform',
    type: 'website',
    url: 'https://trackr-dun.vercel.app',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrackR APEX',
    description: 'Elite GIS Workout Analytics Platform',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="void" suppressHydrationWarning>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
