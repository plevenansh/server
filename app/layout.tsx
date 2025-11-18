import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Live Score Scraper',
  description: 'Real-time live score tracking from multiple sources',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
