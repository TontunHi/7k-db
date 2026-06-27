import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Suspense } from "react"
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker"
import { Inter, Prompt, Cormorant_Garamond } from "next/font/google"
import Script from "next/script"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL('https://7k-db.com'),
  title: {
    default: "7K DB - Seven Knights Rebirth Database & Strategy Guide",
    template: "%s | 7K DB"
  },
  description: "The most comprehensive Seven Knights Rebirth database. Find tier lists, optimal hero builds, stage walkthroughs, raid strategies, and tactical tools in English and Thai.",
  keywords: [
    "Seven Knights Rebirth", "7K Rebirth", "Seven Knights Guide", "7K DB", "Tier List", "Hero Builds",
    "เซเว่นไนท์ รีเบิร์ธ", "แนวทางการเล่น 7K Rebirth", "จัดทีม Seven Knights", "7K Rebirth Database",
    "Seven Knights Rebirth Tier List", "Best Hero Builds 7K"
  ],
  openGraph: {
    title: "7K DB - Seven Knights Rebirth Database & Strategy Guide",
    description: "The ultimate comprehensive database and guide for Seven Knights Rebirth. Tier lists, hero optimal builds, stage guides, and raid strategies.",
    siteName: "7K DB",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "7K DB - Seven Knights Rebirth Database & Strategy Guide",
    description: "The ultimate resource for Seven Knights Rebirth hero builds, tier lists, and strategies.",
  }
}

import { getLocale } from "@/lib/i18n"

export default async function RootLayout({ children }) {
  const lang = await getLocale()

  return (
    <html lang={lang} suppressHydrationWarning className={`${inter.variable} ${prompt.variable} ${cormorantGaramond.variable}`}>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&true))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();` }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
          <Toaster theme="dark" position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
