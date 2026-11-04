import type { Metadata } from 'next';
import { Orbitron, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sector 07 // Cyberpunk Neon Street Experience',
  description: 'An interactive 3D WebGL cyberpunk street scroll experience powered by Three.js and Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-cyber-void text-foreground antialiased selection:bg-cyber-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}

