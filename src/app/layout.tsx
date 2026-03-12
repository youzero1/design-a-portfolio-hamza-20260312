import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alex Johnson — Full-Stack Developer',
  description: 'Personal portfolio of Alex Johnson, a passionate full-stack developer specializing in modern web technologies.',
  keywords: ['developer', 'portfolio', 'full-stack', 'react', 'nextjs', 'typescript'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-gray-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
