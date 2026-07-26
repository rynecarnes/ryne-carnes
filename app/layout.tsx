import type { Metadata } from "next";
import { Inter, Space_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/nav/TopNav";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-space-mono',
});
const vt323 = VT323({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: "Ryne Carnes | Dashboard",
  description: "Personal tools and applications dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} ${vt323.variable} ${spaceMono.className}`}>
        <TopNav />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
