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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${prompt.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
