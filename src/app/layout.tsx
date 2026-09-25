import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'S5 Ressources — Bibliothèque Numérique Génie Civil',
  description: 'Portail centralisé et moderne regroupant les cours, TD, TP, examens et corrigés du semestre S5.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
