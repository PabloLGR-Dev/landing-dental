import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; 
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clínica Dental Premium",
  description: "Tu Mejor Sonrisa, Sin Dolor y Sin Miedo.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any; // <-- Usamos 'any' para evitar el conflicto del validador de Next.js 15
}) {
  
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}