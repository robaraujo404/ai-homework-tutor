import { Nunito } from "next/font/google";
import { PHProvider } from "../providers";
import "../globals.css";
import { Metadata } from "next";
import { getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  
  // O nome do app configurável via variável de ambiente, ou usa o padrão do i18n
  const appName = process.env.NEXT_PUBLIC_APP_NAME || t("title");

  return {
    title: appName,
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${nunito.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PHProvider>
            {children}
          </PHProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
