import { Inter, Prompt } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Suspense } from "react"
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL('https://7k-db.com'),
  title: {
    default: "7K DB - Seven Knights Rebirth Database",
    template: "%s | 7K DB"
  },
  description: "The ultimate comprehensive database and guide for Seven Knights Rebirth. Featuring tier lists, hero optimal builds, stage guides, and raid strategies.",
  keywords: ["Seven Knights Rebirth", "7K Rebirth", "Seven Knights Guide", "7K DB", "Tier List", "Hero Builds"],
  openGraph: {
    title: "Seven Knights Rebirth Database - 7K DB",
    description: "The ultimate comprehensive database and guide for Seven Knights Rebirth. Tier lists, hero optimal builds, stage guides, and raid strategies.",
    siteName: "7K DB",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seven Knights Rebirth Database - 7K DB",
    description: "The ultimate comprehensive database and guide for Seven Knights Rebirth.",
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${prompt.variable} font-sans antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
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
