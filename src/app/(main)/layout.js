import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
    title: {
        default: "Seven Knights Rebirth Database — Builds, Guides, & Tools",
        template: "%s | Seven Knights Rebirth Database"
    },
    description: "The ultimate resource for Seven Knights Rebirth. Find the best hero builds, stage guides, raid strategies, and tier lists.",
    keywords: ["Seven Knights Rebirth", "7K Rebirth", "Seven Knights Database", "7K DB", "Hero Builds", "Raid Guide", "Tier List"],
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
        description: "The ultimate resource for Seven Knights Rebirth. Find the best hero builds, stage guides, raid strategies, and tier lists.",
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
        description: "The ultimate resource for Seven Knights Rebirth. Find the best hero builds, stage guides, raid strategies, and tier lists.",
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

export default function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </>
    )
}
