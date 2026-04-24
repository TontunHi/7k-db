import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import FloatingContactWidget from "@/components/layout/FloatingContactWidget"
import { isContactFormEnabled } from "@/lib/setting-actions"

export const metadata = {
    title: {
        default: "Seven Knights Rebirth Database — Builds, Guides, & Tools",
        template: "%s | Seven Knights Rebirth Database"
    },
    description: "The ultimate community resource for Seven Knights Rebirth. Explore top-tier hero builds, comprehensive stage guides, raid meta analysis, and tactical simulation tools.",
    keywords: [
        "Seven Knights Rebirth", "7K Rebirth", "Seven Knights Database", "7K DB", 
        "Hero Builds", "Raid Guide", "Tier List", "Meta Analysis",
        "เซเว่นไนท์ รีเบิร์ธ", "7K Rebirth ภาษาไทย", "ไกด์เกม 7K Rebirth", 
        "จัดทีมเซเว่นไนท์", "ข้อมูลตัวละคร 7K Rebirth"
    ],
    authors: [{ name: "7K DB Team" }],
    creator: "7K DB Team",
    publisher: "7K DB Team",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://7k-db.com",
        siteName: "Seven Knights Rebirth Database",
        title: "Seven Knights Rebirth Database — Builds, Guides, & Tools",
        description: "Explore the most detailed database for Seven Knights Rebirth. Featuring hero builds, stage guides, and advanced tactical tools.",
        images: [
            {
                url: "/api/og",
                width: 1200,
                height: 630,
                alt: "Seven Knights Rebirth Database",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Seven Knights Rebirth Database — Builds, Guides, & Tools",
        description: "The ultimate resource for Seven Knights Rebirth hero builds, tier lists, and strategies.",
        images: ["/api/og"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

export default async function MainLayout({ children }) {
    const isContactEnabled = await isContactFormEnabled()

    return (
        <>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
            <FloatingContactWidget enabled={isContactEnabled} />
        </>
    )
}
