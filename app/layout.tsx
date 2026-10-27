import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MascotLoader } from "@/components/mascot/loader";
import { OutboundTracker } from "@/components/outbound-tracker";
import { INTRO_GATE } from "@/components/home/intro-gate";
import { JsonLd, personSchema, websiteSchema } from "@/components/json-ld";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  robots: { googleBot: { "max-image-preview": "large" } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Script id="intro-gate" strategy="beforeInteractive">
          {INTRO_GATE}
        </Script>
        <ThemeProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            <MotionProvider>
              {children}
              <MascotLoader />
            </MotionProvider>
          </main>
          <SiteFooter year={new Date().getFullYear()} />
        </ThemeProvider>
        <JsonLd data={[personSchema(), websiteSchema()]} />
        {/* Plausible (self-hosted, cookieless). Production only, so previews and local runs aren't counted. */}
        {process.env.VERCEL_ENV === "production" && (
          <>
            <Script defer data-domain={site.analytics.domain} src={site.analytics.script} strategy="afterInteractive" />
            <OutboundTracker />
          </>
        )}
      </body>
    </html>
  );
}
