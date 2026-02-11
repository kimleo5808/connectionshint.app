import BaiDuAnalytics from "@/app/BaiDuAnalytics";
import GoogleAdsense from "@/app/GoogleAdsense";
import GoogleAnalytics from "@/app/GoogleAnalytics";
import PlausibleAnalytics from "@/app/PlausibleAnalytics";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { LanguageDetectionAlert } from "@/components/LanguageDetectionAlert";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, Locale, routing } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { JsonLd, websiteSchema } from "@/lib/jsonld";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/loading.css";
import { Russo_One, Chakra_Petch } from "next/font/google";

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
import { Analytics } from "@vercel/analytics/react";
import { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return constructMetadata({
    page: "Home",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: `/`,
    canonicalUrl: `/`,
  });
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColors,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale || DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <JsonLd data={websiteSchema()} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background flex flex-col antialiased",
          russoOne.variable,
          chakraPetch.variable,
          "font-body"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme={siteConfig.defaultNextTheme}
            enableSystem
          >
            {messages.LanguageDetection && <LanguageDetectionAlert />}
            {messages.Header && <Header />}

            <main className="flex-1 flex flex-col items-center">
              {children}
            </main>

            {messages.Footer && <Footer />}
          </ThemeProvider>
        </NextIntlClientProvider>
        <TailwindIndicator />
        {process.env.NODE_ENV === "development" ? (
          <></>
        ) : (
          <>
            <Analytics />
            <BaiDuAnalytics />
            <GoogleAnalytics />
            <GoogleAdsense />
            <PlausibleAnalytics />
          </>
        )}
      </body>
    </html>
  );
}
