import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import "../../public/scss/main.scss";

import "../../public/css/tailwind.css";
import "../../public/css/harmonyos_sans.css";
import "../../public/css/harmonyos_sans_tc.css";

import MobileMenu from "@/components/modals/MobileMenu";

import GlobalEffectsProvider from "@/components/common/GlobalEffectProvider";
import QueryContext from "@/context/QueryContext";

import ToastProvider from "@/components/common/ToastProvider";
import HomeHeader from "@/widgets/HomeHeader";

export const metadata = {
  title: "Zgar Vape Website",
  description: "Zgar - Home",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head></head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <main id="wrapper">
            <QueryContext>
              <ToastProvider>
                {children}
                <MobileMenu />
              </ToastProvider>
            </QueryContext>

            <GlobalEffectsProvider />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
